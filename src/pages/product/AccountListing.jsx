
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Popup } from 'pixel-retroui';
import { THEME } from '../Theme';
import Pagination from '@components/Paginator';
import { LuRefreshCw } from 'react-icons/lu';
import { FaEllipsis } from 'react-icons/fa6';
import { MdCheckCircle, MdCancel } from 'react-icons/md';
import { TbBox, TbBoxMultiple } from 'react-icons/tb';
import ReactJson from '@microlink/react-json-view';
import Scroll from '@components/Scroll';
import ProductTable, { Badge, Field, Pill } from '@components/ProductTable';
import ChipFilter from '@components/ChipFilter';
import ProductAccountSelector from '@components/ProductAccountSelector';
import FilterBar from '@components/FilterBar';

const ALWAYS_RENDERED = new Set(['sku', 'barcode', 'status', 'product_type', 'title', 'price', 'images']);

const IMAGE_URL_KEY_BY_MARKETPLACE = {
    shein: 'url',
    amazon: 'url',
    walmart: 'link',
    tiktok: 'uri',
};

function getImageUrl(row, marketplace, imageField) {
    const list = row[imageField] || row.main_images || row.images;
    const first = Array.isArray(list) ? list[0] : null;
    if (!first) return null;
    if (typeof first === 'string') return first;
    const key = IMAGE_URL_KEY_BY_MARKETPLACE[marketplace];
    return (key && first[key]) || first.url || first.link || first.uri || null;
}

function getMarketplace(account) {
    return account?.name?.split('_')[0]?.toLowerCase() || '';
}

const StatusBadge = ({ status }) => {
    if (!status) return null;
    return (
        <Badge
            icon={status === 'active' ? <MdCheckCircle /> : <MdCancel />}
            label={status}
            theme={status === 'active' ? THEME.SUCCESS : THEME.GRAY}
        />
    );
};

const TypeBadge = ({ type }) => {
    if (type === 'variant') return <Badge icon={<TbBoxMultiple />} label='Parent' theme={THEME.ACCENT} />;
    if (type === 'simple') return <Badge icon={<TbBox />} label='Simple' />;
    return null;
};

const HeaderRow = ({ title, id }) => (
    <div className='flex items-center gap-2 w-full min-w-0'>
        <span
            className='font-bold leading-snug overflow-hidden text-ellipsis min-w-0'
            style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                wordBreak: 'break-word',
            }}
            title={title}
        >
            {title || '—'}
        </span>
        {id && <span className='text-xs opacity-50 font-mono truncate shrink-0'>{id}</span>}
    </div>
);

const PER_PAGE = 9;



const Products = ({ products, keyMap, setPopup, marketplace }) => {
    const titleField = keyMap?.title?.original_field || 'title';
    const imageField = keyMap?.images?.original_field || 'main_images';

    const fixedColumns = [
        {
            render: (row) => (
                <Field label='Price'>
                    {row.price != null && row.price !== '' ? `$${row.price}` : '—'}
                </Field>
            ),
        },
        {
            render: (row) => <Field label='SKU'>{row.sku || '—'}</Field>,
        },
        {
            render: (row) => <Field label='Barcode'>{row.barcode || '—'}</Field>,
        },
    ];

    const dynamicColumns = keyMap
        ? Object.keys(keyMap)
            .filter((k) => !ALWAYS_RENDERED.has(k) && !ALWAYS_RENDERED.has(keyMap[k].original_field))
            .map((k) => ({
                label: k,
                format: (_, row) => {
                    const field = row[keyMap[k].original_field];
                    return typeof field === 'object' ? null : field;
                },
            }))
        : [];

    const columns = [...fixedColumns, ...dynamicColumns];

    const actions = [
        {
            render: (row) => (
                <button onClick={() => setPopup(row)} className="cursor-pointer text-white p-1">
                    <FaEllipsis />
                </button>
            ),
        },
    ];

    return (
        <ProductTable
            items={products}
            columns={columns}
            actions={actions}
            getImage={(row) => getImageUrl(row, marketplace, imageField)}
            getHeader={(row) => (
                <HeaderRow
                    title={row[titleField]}
                    id={row._id?.$oid || row._id || row.id}
                />
            )}
            getBadges={(row) => (
                <>
                    <StatusBadge status={row.status} />
                    <TypeBadge type={row.product_type} />
                </>
            )}
            emptyMessage="No unlinked products"
        />
    );
};

const STOCK_OPTIONS = [
    { label: 'All', value: false },
    { label: 'In', value: '\\b([1-9]\\d*)\\b' },
    { label: 'Out', value: '\\b0\\b' },
];

const STATUS_OPTIONS = [
    { label: 'All', value: false },
    { label: 'Active', value: 'active' },
    { label: 'Failed', value: 'FAILED' },
    { label: 'Draft', value: 'DRAFT' },
];
const Main = ({ di, allProducts = false }) => {

    function fetchAccounts(di) {
        return di.request.get({
            url: di.api.get('account-all'),
            callback: (data) => {
                setAccounts(data.data);
            }
        });
    }

    function fetchProducts(account, di, setCursor, nextCursor, filter, statusFilter) {
        return di.request.get({
            url: di.api.get('unlinked-products') + "?account_id=" + account.id
                + "&per_page=" + PER_PAGE +
                (nextCursor ? "&cursor=" + nextCursor : "") +
                (allProducts ? "&all_products=true" : "") +
                (filter ? "&filter[quantity][1]=" + filter : "") +
                (statusFilter ? "&filter[status][1]=" + encodeURIComponent(statusFilter) : ""),
            callback: (data) => {
                setProducts(data.data);
                setKeyMap(data.key_map);
                setCursor(data.cursor);
            }
        });
    }

    const [account, setAccount] = useState(0);
    const [accounts, setAccounts] = useState([]);
    const [products, setProducts] = useState([]);
    const [keyMap, setKeyMap] = useState({});
    const [cursor, setCursor] = useState(false);
    const [nextCursor, setNextCursor] = useState(false);
    const [filter, setFilter] = useState(false);
    const [statusFilter, setStatusFilter] = useState(false);
    const [page, setPage] = useState(1);
    const [popup, setPopup] = useState(false);
    useEffect(() => {
        fetchAccounts(di);
    }, []);

    useEffect(() => {
        if (accounts[account]) {
            fetchProducts(accounts[account], di, setCursor, nextCursor, filter, statusFilter);
        }
    }, [account, accounts, nextCursor, filter, statusFilter]);

    if (!accounts || !accounts[account]) {
        return <div>Loading...</div>;
    }

    return (
        <div className='flex flex-col gap-5 p-5 h-full min-h-0'>
            <Popup {...THEME.SECONDARY} isOpen={popup} onClose={() => setPopup(false)}>
                <div className='w-256 h-128'>
                    <Scroll>
                        <ReactJson src={popup} theme={THEME.JSON.DEFAULT} />
                    </Scroll>
                </div>
            </Popup>
            <FilterBar>
                <Pagination page={page} setPage={setPage} cursor={cursor} setNextCursor={setNextCursor} />
                <Button {...THEME.ACTIVE} onClick={(e) => { setNextCursor(false); }}><LuRefreshCw className='text-2xl duration-500'
                    onTransitionEnd={(e) => { e.target.style.transform = "rotate(0deg)"; }}
                    onClick={
                        (e) => { e.target.style.transform = "rotate(360deg)"; }
                    } /></Button>
                <ProductAccountSelector accounts={accounts} account={accounts[account]} setAccount={setAccount} />
                <ChipFilter
                    label='Stock'
                    value={filter}
                    options={STOCK_OPTIONS}
                    onChange={(v) => { setCursor(false); setNextCursor(false); setFilter(v); }}
                />
                {allProducts && (
                    <ChipFilter
                        label='Status'
                        value={statusFilter}
                        options={STATUS_OPTIONS}
                        onChange={(v) => { setCursor(false); setNextCursor(false); setStatusFilter(v); }}
                    />
                )}
            </FilterBar>
            <Products products={products} keyMap={keyMap} setPopup={setPopup} marketplace={getMarketplace(accounts[account])} />
        </div>
    )
}
export default Main;