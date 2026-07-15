
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Input, Popup } from 'pixel-retroui';
import { THEME } from '../Theme';
import toast from 'react-hot-toast';
import NYAN from '@assets/nyan-loader.webp';
import { BiDownload } from 'react-icons/bi';
import { MdCheckCircle, MdCancel } from 'react-icons/md';
import { TbBox, TbBoxMultiple, TbGitBranch } from 'react-icons/tb';
import ProductTable, { Pill, Badge, Field } from '@components/ProductTable';
import ChipFilter from '@components/ChipFilter';
import Pagination from '@components/Paginator';

const TYPE_OPTIONS = [
    { label: 'All', value: false },
    { label: 'Simple', value: 'simple' },
    { label: 'Parent', value: 'parent' },
    { label: 'Variant', value: 'child' },
];

const PER_PAGE = 5;

const Grid = ({ products, di }) => {
    const [accountsById, setAccountsById] = useState({});

    useEffect(() => {
        di.request.get({
            url: di.api.get('account-all'),
            callback: (data) => {
                const map = {};
                (data?.data || []).forEach((a) => { map[a.id] = a; });
                setAccountsById(map);
            },
        });
    }, []);

    function resolveChannels(e) {
        const ids = e.u_account_id || [];
        if (!Array.isArray(ids) || ids.length === 0) return null;
        const names = ids.map((id) => {
            const oid = typeof id === 'object' ? id?.$oid : id;
            const a = accountsById[oid];
            return a?.name?.replaceAll('_', ' ') || oid;
        });
        return names.join(', ');
    }

    function typeBadge(e) {
        const isParent = e.u_product_type === 'variant';
        const isVariant = e.u_product_type === 'simple' && e.u_relation_id;
        if (isParent) return <Badge icon={<TbBoxMultiple />} label="Parent" theme={THEME.ACCENT} />;
        if (isVariant) return <Badge icon={<TbGitBranch />} label="Variant" theme={THEME.WARNING} />;
        return <Badge icon={<TbBox />} label="Simple" />;
    }

    const getHeader = (e) => (
        <div className="flex items-center gap-2 min-w-0">
            <span className="text-base font-bold truncate" title={e.title}>{e.title}</span>
            <span className="text-xs opacity-50 font-mono truncate">{e._id || e.id}</span>
        </div>
    );

    const getBadges = (e) => (
        <>
            <Badge
                icon={e.status === 'active' ? <MdCheckCircle /> : <MdCancel />}
                label={e.status}
                theme={e.status === 'active' ? THEME.SUCCESS : THEME.GRAY}
            />
            {typeBadge(e)}
        </>
    );

    const columns = [
        { field: 'sku', label: 'SKU' },
        {
            label: 'Price',
            render: (e) => <Field label='Price'>${e.price}</Field>,
        },
        {
            render: (e) => {
                const channels = resolveChannels(e);
                return channels ? <Field label='Channels'>{channels}</Field> : null;
            },
        },
        { field: 'barcode', label: 'Barcode' },
    ];

    const actions = [
        {
            label: 'Delete',
            theme: THEME.DANGER,
            onClick: (e) =>
                di.request.post({
                    url: di.api.get('product-delete'),
                    body: JSON.stringify({ ids: [e.id], operation_type: 'selected' }),
                }),
        },
    ];

    return (
        <ProductTable
            items={products?.data}
            columns={columns}
            actions={actions}
            getImage={(e) => e.images?.[0]?.url}
            getHeader={getHeader}
            getBadges={getBadges}
            emptyMessage="No products"
        />
    );
};

const FileUpload = ({ di }) => {
    const [hash, setHash] = useState(false);

    return (
        <div className='pt-5 h-full flex flex-col hustify-center items-center gap-5'>
            <Input {...THEME.ACTIVE_INPUT} onChange={(e) => {
                let formData = new FormData();
                formData.append('file', e.target.files[0]);
                di.request.get({
                    url: di.api.get('get-upload-url', 'catalog') + `?access=private`, callback: r => {
                        di.request.post({
                            url: r.url, body: formData, headers: {}, callback: re => {
                                toast.success('Image uploaded successfully');
                                setHash(re.hash);
                            }
                        });
                    }
                })
            }} type='file' />
            <div className='w-full flex justify-between h-full items-end'>
                <a href="#" onClick={() => {
                    di.request.get({
                        url: di.api.get('product-csv', 'catalog'), callback: (data) => {
                            di.navigate(data.url);
                        }
                    });
                }}>Download template</a>
                {hash &&
                    < Button {...THEME.ACTIVE} onClick={() => {
                        di.request.post({
                            url: di.api.get('product-import', 'catalog'),
                            body: JSON.stringify({
                                hash: hash,
                                type: 'feed',
                                marketplace: 'cedcommerce-csv',
                            })
                        });
                    }
                    }>Import</Button>
                }
            </div>
        </div >
    )
}
function Import({ di }) {
    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        di.request.get({
            url: di.api.get('account-all'),
            callback: (data) => {
                setAccounts(data.data);
            }
        });
    }, []);
    const [data, setData] = useState(null);
    const [response, setResponse] = useState(null);
    const importType = {
        amazon: 'feed',
        walmart: 'feed',
        shein: 'api',
        tiktok: 'api',
    }

    const loadingResponse = (
        <div className='rounded-xl border-2! border-blue-400! flex flex-col gap-5 justify-center items-center w-24 h-24'
            style={{
                backgroundImage: `url(${NYAN})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
            }}>
        </div>
    );
    const renderResult = (res) => (
        <p className={`${res.success ? 'text-green-500' : 'text-red-500'}`}>
            {res.message ?? res.messsage ?? ""}
        </p>
    );

    function triggerAutoLink(product_type) {
        if (!data) {
            setResponse(<p className='text-red-500'>Please select an account</p>);
            return;
        }
        const business_id = di.getCurrentBusiness();
        if (!business_id) {
            setResponse(<p className='text-red-500'>No business selected</p>);
            return;
        }
        setResponse(loadingResponse);
        di.request.post({
            url: di.api.get('product-autolink'),
            body: JSON.stringify({
                marketplace: data.marketplace,
                product_type,
                business_id,
                account_id: data.account_id,
            }),
            callback: (res) => setResponse(renderResult(res)),
            error_callback: (res) => setResponse(renderResult(res)),
        });
    }

    return (
        <div className='w-128 flex flex-col gap-5 justify-between items-start p-5'>
                <p>Import from marketplace</p>
                <DropdownMenu className='w-full'>
                    <DropdownMenuTrigger {...THEME.SECONDARY}>
                        {data ? accounts.filter(account => account.id == data.account_id)[0].name : 'Select Account'}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent {...THEME.SECONDARY} className='flex flex-col gap-1'>
                        {accounts.map((account) => (
                            <DropdownMenuItem key={account.id}>
                                <Button {...THEME.SEAMLESS} onClick={() => {
                                    setData({
                                        account_id: account.id,
                                        channel_id: account.channel_id,
                                        marketplace: account.name.split('_')[0].toLowerCase(),
                                        type: importType[account.name.split('_')[0].toLowerCase()],
                                    });
                                }}>
                                    {account.name}
                                </Button>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className='flex gap-3'>
                    <Button {...THEME.SUCCESS} onClick={() => {
                        if (data) {
                            setResponse(loadingResponse);
                            di.request.post({
                                url: di.api.get('product-import'),
                                body: JSON.stringify(data),
                                callback: (res) => setResponse(renderResult(res)),
                                error_callback: (res) => setResponse(renderResult(res)),
                            });
                        } else {
                            setResponse(<p className='text-red-500'>Please select an account</p>);
                        }
                    }}>
                        Start Import
                    </Button>
                </div>

                <div className='w-full border-t border-white/15 pt-3 flex flex-col gap-3'>
                    <p>Auto Link</p>
                    <p className='text-xs opacity-60'>Match marketplace products to catalog by SKU / barcode (per account's linking preference).</p>
                    <div className='flex gap-3'>
                        <Button {...THEME.ACCENT} onClick={() => triggerAutoLink('simple')}>
                            Auto Link Simple
                        </Button>
                        <Button {...THEME.ACCENT} onClick={() => triggerAutoLink('variant')}>
                            Auto Link Variant
                        </Button>
                    </div>
                </div>

                <div className='w-full items-center justify-center flex h-32'>
                    {response ?? ""}
                </div>
        </div>
    )
}
const Products = ({ di }) => {
    const [products, setProducts] = useState(false);
    const [cursor, setCursor] = useState(false);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState(false);
    const [filter, setFilter] = useState(false);

    const FILTERS = {

        simple: {
            and_filter: {
                u_product_type: { '1': "simple" },
                u_visibility: { '1': 1 }
            }
        },

        parent: {
            and_filter: {
                u_product_type: { '1': "variant" },
                u_relation_id: { '12': "1" }
            }
        },

        child: {
            and_filter: {
                u_product_type: { '1': "simple" },
                u_visibility: { '1': 2 }
            }
        },
    };

    function urlEncodeObject(obj, prefix = '') {
        const query = [];
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const formattedKey = prefix ? `${prefix}[${key}]` : key;
                const value = obj[key];
                if (typeof value === 'object' && value !== null) {
                    // Recursively handle nested objects
                    query.push(urlEncodeObject(value, formattedKey));
                } else {
                    // Encode key-value pairs
                    query.push(`${formattedKey}=${encodeURIComponent(value)}`);
                }
            }
        }
        return query.join('&');
    }

    const [popupOpen, setPopupOpen] = useState(false);
    useEffect(() => {
        const typeFilter = filter ? urlEncodeObject(FILTERS[filter].and_filter, 'and_filter') : '';
        di.request.get({
            url: di.api.get('product') + `?${cursor ? 'cursor=' + cursor : ""}` +
                `&per_page=${PER_PAGE ?? 10}` +
                `&${search ? 'filter[sku][3]=' + search : ""}` +
                `&${typeFilter}`, callback: data => {
                    setProducts({ ...data });
                }
        });
    }, [cursor, search, filter]);
    const searchTimer = useRef(null);
    return (
        <div className='w-full h-full flex flex-col gap-5 justify-center items-center p-5 min-w-0 overflow-hidden'>
            <Popup {...THEME.SECONDARY} isOpen={popupOpen} onClose={() => setPopupOpen(false)}>
                {/* <FileUpload di={di} /> */}
                <Import di={di} />
            </Popup>
            <div className='flex flex-col gap-5 justify-center items-between h-full grow w-full min-w-0 overflow-hidden'>
                <Card {...THEME.SECONDARY} className='flex gap-5 items-center justify-center text-2xl w-auto px-5 py-3'>
                    <span>
                        Products
                    </span>
                    <Input {...THEME.ACTIVE_INPUT} className='grow ' placeholder='Search SKU' onChange={(e) => {
                        clearTimeout(searchTimer.current);
                        searchTimer.current = setTimeout(() => {
                            setCursor(false);
                            setSearch(e.target.value);
                        }, 700);
                    }}></Input>
                    <ChipFilter
                        label='Type'
                        value={filter}
                        options={TYPE_OPTIONS}
                        onChange={(v) => { setCursor(false); setFilter(v); }}
                    />
                    <Button {...THEME.ACTIVE} onClick={() => setPopupOpen(true)} className='p-2'> <BiDownload className='text-3xl' /> </Button>
                </Card>

                <div {...THEME.SECONDARY} className='w-full grow min-w-0 min-h-0 overflow-hidden flex'>
                    <Grid products={products} di={di}></Grid>
                </div>
                <div className='flex justify-center'>
                    <Pagination page={page} setPage={setPage} cursor={products?.cursor} setNextCursor={setCursor} />
                </div>
            </div>
        </div >
    );
};
export default Products;