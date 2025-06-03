/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Input, Popup } from 'pixel-retroui';
import { THEME } from './Theme';
import { TbTriangleFilled } from "react-icons/tb";
import { FaFileCsv } from "react-icons/fa6";
import toast from 'react-hot-toast';



const BG = "product-bg.gif";
const PER_PAGE = 5;

const Table = ({ products }) => {
    const tdClass = 'px-5 overflow-hidden';
    return (
        <table >
            <tbody>
                <tr>
                    <th></th>
                    <th></th>
                    <th>Title</th>
                    <th>SKU</th>
                    <th>Price</th>
                </tr>
                {
                    products && products.data.map((e, i) => {
                        const isVariant = e.u_product_type == 'variant' && !e.u_relation_id;
                        return (
                            <tr key={e.id} className={!isVariant ? 'border-t-2 border-amber-800/25' : ""}>
                                <td>#{i}</td>
                                <td className="">
                                    <img className='w-16 min-h-16 aspect-square rounded-xl'
                                        src={e.images[0].url}></img>
                                </td>
                                <td className={tdClass}>
                                    <div className='flex flex-col'>
                                        {e.title}{
                                            (() => {
                                                if (isVariant) {
                                                    return (<span className='text-sm text-amber-800'>Variant</span>);
                                                }
                                            })()
                                        }
                                    </div>
                                </td>
                                <td className={tdClass}>{e.sku}</td>
                                <td className={tdClass + ' text-right'}>{e.price}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>);
}

const Grid = ({ products, di }) => {
    return (
        <div className='flex flex-col gap-5'>
            {
                products?.data && products.data.map((e, i) => {
                    const isVariant = e.u_product_type == 'variant' && !e.u_relation_id;
                    return (
                        <Card key={e.id} {...THEME.MUDDY} className={'bg-cover bg-center items-center flex flex-col-reverse gap-2 border-box'}>
                            <div className={`flex w-full h-full items-center gap-5`}>
                                <img className='w-16 aspect-square rounded-xl'
                                    src={e.images?.length?e.images[0].url:"na"}></img>
                                <div className='flex flex-col justify-start h-full items-start gap-0'>
                                    <div className='flex justify-start items-center w-full gap-5'>
                                        <span>{e.title}</span>
                                        <span>${e.price}</span>
                                        <span className>SKU: {e.sku}</span>
                                    </div>
                                    <div className='flex justify-start items-center w-full gap-5'>
                                        <span className='text-orange-900 capitalize'>Type: {e.u_product_type}</span>
                                        <span className='text-orange-900 capitalize'>{isVariant ? "Variant" : ""}</span>
                                        <span className>ID: {e.id}</span>
                                    </div>
                                </div>
                                <Button onClick={() => {
                                    di.request.post({ url: di.api.get('product-delete'), body: JSON.stringify({ ids: [e.id], operation_type: "selected" }) })
                                }}>Delete</Button>
                            </div>
                        </Card>
                    )
                })
            }
        </div >
    );
}

const FileUpload = ({ di }) => {
    const [hash, setHash] = useState(false);

    return (
        <div className='pt-5 h-full flex flex-col hustify-center items-center gap-5'>
            <input onChange={(e) => {
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
                            window.location = data.url;
                        }
                    });
                }}>Download template</a>
                {hash &&
                    < Button {...THEME.POP} onClick={() => {
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

const Products = ({ di }) => {
    const [products, setProducts] = useState(false);
    const [cursor, setCursor] = useState(false);
    const [search, setSearch] = useState(false);
    const [filter, setFilter] = useState(false);

    const FILTERS = {

        simple: {
            and_filter: { u_product_type: { '1': "simple" } }
        },

        parent: {
            and_filter: {
                u_product_type: { '1': "variant" },
                u_relation_id: { '12': "1" }
            }
        },

        child: {
            and_filter: {
                u_product_type: { '1': "variant" },
                u_relation_id: { '12': "0" }
            }
        },
    };

    function prepTypeFilter(type) {
        let xp = urlEncodeObject(FILTERS[type].and_filter, 'and_filter');
        setFilter(xp);
    }
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
        di.request.get({
            url: di.api.get('product') + `?${cursor ? 'cursor=' + cursor : ""}` +
                `&per_page=${PER_PAGE ?? 10}` +
                `&${search ? 'filter[sku][3]=' + search : ""}` +
                `&${filter ? filter : ""}`, callback: data => {
                    setProducts({ ...data });
                }
        });
    }, [cursor, search, filter]);
    let tt;
    return (
        <div style={{ backgroundImage: `url('${BG}')` }} className='w-full h-full flex flex-col gap-5 justify-center items-center bg-cover bg-center p-5'>
            <Popup {...THEME.MUDDY} isOpen={popupOpen} onClose={() => setPopupOpen(false)}>
                <FileUpload di={di} />
            </Popup>
            <div className='flex flex-col gap-5 justify-center items-center h-full w-3/4'>
                <Card {...THEME.MUDDY} className='flex gap-5 items-center justify-center text-2xl w-full px-5 py-3'>
                    <span>
                        Products
                    </span>
                    <Input className='grow ' placeholder='Search SKU' onChange={(e) => {
                        clearInterval(tt);
                        tt = setTimeout(() => {
                            setSearch(e.target.value);
                        }, 700);
                    }}></Input>
                    <DropdownMenu {...THEME.POP} className=''>
                        <DropdownMenuTrigger className=''>
                            Filter
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <div className='flex flex-col gap-3 items-start justify-start'>
                                    <p>Type: </p>
                                    <div className='flex flex-col justify-center gap-5'>
                                        <Button onClick={() => { prepTypeFilter('simple') }}>Simple</Button>
                                        <Button onClick={() => { prepTypeFilter('parent') }}>Parent</Button>
                                        <Button onClick={() => { prepTypeFilter('child') }}>Variant</Button>
                                    </div>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button {...THEME.POP} onClick={() => setPopupOpen(true)} className='p-2'> <FaFileCsv className='text-3xl' /> </Button>
                </Card>
                <div {...THEME.MUDDY} className='w-full grow overflow-auto'>
                    <Grid products={products} di={di}></Grid>
                </div>
                <div className='flex'>
                    <Button className={`py-2 px-5 ${products?.cursor?.prev ? '' : 'opacity-25'}`} {...THEME.POP} onClick={() => { setCursor(products.cursor.prev); }}>
                        <TbTriangleFilled className='-rotate-90 text-yellow-900/75' /></Button>
                    <Card className='py-2 px-4' {...THEME.MUDDY}></Card>
                    <Button className={`py-2 px-5 ${products?.cursor?.next ? '' : 'opacity-25'}`}{...THEME.POP} onClick={() => { setCursor(products.cursor.next); }}>
                        <TbTriangleFilled className='rotate-90 text-yellow-900/75' /></Button>
                </div>
            </div>
        </div >
    );
};
export default Products;