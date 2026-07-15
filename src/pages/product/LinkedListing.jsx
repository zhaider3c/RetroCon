/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Popup } from 'pixel-retroui';
import { THEME } from '../Theme';
import Pagination from '@components/Paginator';
import { LuRefreshCw } from 'react-icons/lu';
import { MdCheckCircle, MdCancel } from 'react-icons/md';
import { TbBox, TbBoxMultiple } from 'react-icons/tb';
import ProductTable, { Badge, Field, Pill } from '@components/ProductTable';
import ProductAccountSelector from '@components/ProductAccountSelector';
import FilterBar from '@components/FilterBar';
import ChipFilter from '@components/ChipFilter';

const LINK_STATUS_OPTIONS = [
    { label: 'Full', value: 'full' },
    { label: 'Partial', value: 'partial' },
];

const PER_PAGE = 10;

const IMAGE_URL_KEY_BY_MARKETPLACE = {
    shein: 'url',
    amazon: 'url',
    walmart: 'link',
    tiktok: 'uri',
};

function getImageUrl(row, marketplace) {
    if (!row) return null;
    const fields = ['main_images', 'images'];
    for (const f of fields) {
        const list = row[f];
        const first = Array.isArray(list) ? list[0] : null;
        if (!first) continue;
        if (typeof first === 'string') return first;
        const key = IMAGE_URL_KEY_BY_MARKETPLACE[marketplace];
        const url = (key && first[key]) || first.url || first.link || first.uri;
        if (url) return url;
    }
    return null;
}


const VariantsModal = ({ row, marketplace }) => {
    if (!row) return null;
    const mp = row[marketplace] || {};
    const links = mp.u_linking_data?.links || [];
    const isPartial = mp.u_linking_data?.status === 'partial';

    const columns = [
        { label: 'Marketplace child _id', field: 'from' },
        { label: 'Unicon product _id', field: 'to' },
        { label: 'Marketplace', field: 'marketplace' },
    ];

    return (
        <div className='w-256 max-w-full flex flex-col gap-3'>
            <div className='flex flex-col gap-1'>
                <p className='text-lg font-bold'>{mp.title || 'Variants'}</p>
                <p className='text-xs opacity-70'>
                    SKU {mp.sku} · {links.length} mapped variant{links.length !== 1 ? 's' : ''}
                    {isPartial && ' · some variants are not linked yet'}
                </p>
            </div>
            <ProductTable
                items={links}
                columns={columns}
                idKey="from"
                emptyMessage="No linked variants"
            />
        </div>
    );
};

const Main = ({ di }) => {
    const [accounts, setAccounts] = useState([]);
    const [account, setAccount] = useState(0);
    const [products, setProducts] = useState([]);
    const [marketplace, setMarketplace] = useState('');
    const [cursor, setCursor] = useState(null);
    const [nextCursor, setNextCursor] = useState(false);
    const [page, setPage] = useState(1);
    const [linkStatus, setLinkStatus] = useState('full');
    const [variantsModal, setVariantsModal] = useState(null);

    useEffect(() => {
        di.request.get({
            url: di.api.get('account-all'),
            callback: (data) => { setAccounts(data.data); },
        });
    }, []);

    useEffect(() => {
        if (!accounts[account]) return;
        const endpoint = linkStatus === 'partial' ? 'partial-linked-products' : 'linked-products';
        di.request.get({
            url: di.api.get(endpoint)
                + `?account_id=${accounts[account].id}`
                + `&per_page=${PER_PAGE}`
                + (nextCursor ? `&cursor=${nextCursor}` : ''),
            callback: (res) => {
                setProducts(res.data || []);
                setMarketplace(res.marketplace || '');
                setCursor(res.cursor || null);
            },
        });
    }, [account, accounts, nextCursor, linkStatus]);

    if (!accounts || !accounts[account]) {
        return <div className='p-5'>Loading...</div>;
    }

    const getMp = (row) => (marketplace && row[marketplace]) || {};
    const getUnicon = (row) => row.cedcommerce || null;

    const getHeader = (row) => {
        const mp = getMp(row);
        return (
            <div className='flex items-center gap-2 min-w-0'>
                <span className='font-bold truncate' title={mp.title}>{mp.title || '—'}</span>
                <span className='text-xs opacity-50 font-mono truncate'>{mp._id || '—'}</span>
            </div>
        );
    };

    const getBadges = (row) => {
        const mp = getMp(row);
        return (
            <>
                {mp.status && (
                    <Badge
                        icon={mp.status === 'active' ? <MdCheckCircle /> : <MdCancel />}
                        label={mp.status}
                        theme={mp.status === 'active' ? THEME.SUCCESS : THEME.GRAY}
                    />
                )}
                {mp.product_type === 'variant' && (
                    <Badge icon={<TbBoxMultiple />} label='Parent' theme={THEME.ACCENT} />
                )}
                {mp.product_type === 'simple' && (
                    <Badge icon={<TbBox />} label='Simple' />
                )}
            </>
        );
    };

    const columns = [
        {
            render: (row) => {
                const sku = getMp(row).sku;
                return sku ? <Field label='SKU'>{sku}</Field> : null;
            },
        },
        {
            render: (row) => {
                const price = getMp(row).price;
                return price != null && price !== '' ? <Field label='Price'>${price}</Field> : null;
            },
        },
        {
            render: (row) => {
                const bc = getMp(row).barcode;
                return bc ? <Field label='Barcode'>{bc}</Field> : null;
            },
        },
        {
            render: (row) => {
                const u = getUnicon(row);
                return (
                    <Field label='Linked _id'>
                        <span className='font-mono text-xs'>{u?._id || '—'}</span>
                    </Field>
                );
            },
        },
        {
            render: (row) => <Field label='Linked SKU'>{getUnicon(row)?.sku || '—'}</Field>,
        },
    ];

    const actions = [
        {
            label: 'Variants',
            theme: THEME.ACCENT,
            onClick: (row) => setVariantsModal(row),
        },
    ];

    return (
        <div className='flex flex-col gap-5 p-5 h-full min-h-0'>
            <Popup {...THEME.SECONDARY} isOpen={!!variantsModal} onClose={() => setVariantsModal(null)}>
                <VariantsModal row={variantsModal} marketplace={marketplace} />
            </Popup>
            <FilterBar>
                <Pagination page={page} setPage={setPage} cursor={cursor} setNextCursor={setNextCursor} />
                <Button {...THEME.ACTIVE} onClick={() => setNextCursor(false)}>
                    <LuRefreshCw className='text-2xl duration-500'
                        onTransitionEnd={(e) => { e.target.style.transform = 'rotate(0deg)'; }}
                        onClick={(e) => { e.target.style.transform = 'rotate(360deg)'; }} />
                </Button>
                <ProductAccountSelector accounts={accounts} account={accounts[account]} setAccount={setAccount} />
                <ChipFilter
                    label='Link'
                    value={linkStatus}
                    options={LINK_STATUS_OPTIONS}
                    onChange={(v) => { setLinkStatus(v); setNextCursor(false); }}
                />
            </FilterBar>
            <ProductTable
                items={products}
                columns={columns}
                actions={actions}
                getImage={(row) => getImageUrl(getMp(row), marketplace) || getUnicon(row)?.images?.[0]?.url}
                getHeader={getHeader}
                getBadges={getBadges}
                emptyMessage={`No ${linkStatus === 'full' ? 'fully' : 'partially'} linked products`}
            />
        </div>
    );
};

export default Main;
