/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Input, Popup } from 'pixel-retroui';
import { THEME } from './Theme';
import { TbTriangleFilled } from "react-icons/tb";
import toast from 'react-hot-toast';
import { RiDeleteBinFill } from 'react-icons/ri';


const BG = "https://media.licdn.com/dms/image/v2/C5622AQELEjXGaw74OA/feedshare-shrink_800/feedshare-shrink_800/0/1617991168518?e=2147483647&v=beta&t=pZvDdEB_rbXUeYv_cp54DRdnTItrBywdDIqCEXtsuz4";

async function loadClassification(di, cursor, filter = false, setData) {
    let attrData;
    let url = di.api.get('classification')
        + "?per_page=16"
        + (filter ? `${filter}` : "")
        + (cursor ? `&cursor=${cursor}` : "")
        + ("&options[sort][is_required]=1")
    await di.request.get({
        url: url,
        callback: data => {
            data.data = data.data.sort((a, b) => {
                return a.is_required ? -1 : 1;
            });
            setData(data)
        }
    });
    return attrData;
}

const CreateClassification = ({ di }) => {
    const [products, setProducts] = useState([]);
    const [selected, setSelected] = useState([]);
    const [name, setName] = useState([]);
    useEffect(() => {
        di.request.get({
            url: di.api.get('product') + "?per_page=10",
            callback: ((e) => {
                setProducts(e.data);
            })
        })
    }, []);
    return (
        <div className='flex flex-col gap-5'>
            <Input {...THEME.ACTIVE_INPUT} placeholder='Name' onChange={(e) => {
                setName(e.target.value)
            }} />
            <DropdownMenu {...THEME.ACTIVE}>
                <DropdownMenuTrigger>
                    Products
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem {...THEME.ACTIVE} className='h-96 overflow-auto p-3 flex flex-col gap-5'>
                        {
                            products && products.map((x, i) => {
                                return (
                                    <div key={i} className='flex gap-3 max-w-96'>
                                        <Input {...THEME.ACTIVE_INPUT} data-id={x.id} type='checkbox' onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelected([e.target.getAttribute('data-id'), ...selected])
                                            }
                                        }} />
                                        <div className='flex flex-col'>
                                            <span className='text-nowrap'>
                                                {x.id}
                                            </span>
                                            <span className='text-nowrap'>
                                                {x.title}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Button {...THEME.ACTIVE} onClick={() => {
                di.request.post({
                    url: di.api.get('classification'),
                    body: JSON.stringify({
                        name: name,
                        products: { selected: selected },
                        attribute_set_id: "67e3daf580c1a2c67105557a"
                    }),
                    callback: (e) => {
                        if (e.success) {
                            toast.success(e.message)
                        } else {
                            toast.error(e.message)
                        }
                    }
                })
            }}>Save</Button>
        </div >
    )
}

const ShowClassification = ({ data }) => {
    return (<div className='flex flex-col gap-5'>
        <div>
            <p className='text-2xl'>Details</p>
        </div>
        <div className='grid grid-cols-2 gap-3'>
            {
                Object.keys(data).map((x, i) => {
                    let value = (typeof data[x] === 'object' || Array.isArray(data[x])) ? JSON.stringify(data[x]) : data[x].toString();
                    return (
                        <div key={i} className='flex flex-col justify-between items-start bg-orange-900/25 rounded-xl p-3'>
                            <span className=''>{x.toUpperCase()}</span>
                            <span className='w-full text-center text-2xl'>{
                                value
                            }</span>
                        </div>
                    )
                })
            }
        </div>
    </div>)
}

const Attributes = ({ attributes, setter, di, curosr }) => {
    const [popupOpen, setPopupOpen] = useState(false);
    const [singleDisplay, setSingleDisplay] = useState(false);
    const [filter, setFilter] = useState(0);
    const [singleAttribute, setSingleAttribute] = useState(false);
    const filterValues = [
        ['All', false],
        ['Required only', "&filter[is_required][1]=1"],
        ['Optional only', "&filter[is_required][1]=0"],
    ];
    useEffect(() => {
        loadClassification(di, curosr, filterValues[filter][1], setter);
    }, [filter]);
    return (<div className='flex justify-start flex-col overflow-hidden items-between gap-5 w-full h-full p-3' {...THEME.SECONDARY}>
        <Popup {...THEME.SECONDARY} isOpen={popupOpen} onClose={() => setPopupOpen(false)}>
            <CreateClassification di={di} />
        </Popup>
        <Popup {...THEME.SECONDARY} isOpen={singleDisplay} onClose={() => setSingleDisplay(false)}>
            <ShowClassification data={singleAttribute} />
        </Popup>
        <Card {...THEME.SECONDARY} className='flex gap-3 justify-between items-center'>
            <div className='flex gap-3 justify-start items-center'>
                <p className='text-2xl'>Classification</p>
                <Button className='min-w-32' {...THEME.ACTIVE} onClick={e => {
                    setFilter((filter + 1) % filterValues.length);
                }} >{filterValues[filter][0]}</Button>
            </div>
            <div>
                <Button {...THEME.ACTIVE} onClick={() => {
                    setPopupOpen(true);
                }}>Create</Button>
                <Button {...THEME.ACTIVE} onClick={() => {
                    di.request.get({
                        url: di.api.get('classification-recount'), callback: (e) => {
                            if (e.success) {
                                toast.success(e.message + '. Refreshing feed');
                                setTimeout(() => {
                                    di.navigate('/classification');
                                }, 2300)
                            } else {
                                toast.error(e.message)
                            }
                        }
                    })
                }}>Recount</Button>
            </div>
        </Card >
        <div className='flex flex-col gap-5 justify-start items-center overflow-hidden backdrop-blur-md rounded-xl'>
            <div className='grid grid-cols-4 w-full gap-5 items-start p-5'>
                {
                    attributes?.map((e, index) => {
                        return <Card key={e.id} className={`flex flex-col grid-span-1 border-2 items-start justify-center
                         rounded-xl px-5 py-3 h-full`} {...THEME.SECONDARY} onClick={(event) => {
                                event.stopPropagation();
                                setSingleAttribute(JSON.parse(event.target.querySelector('#full-data').innerHTML));
                                setSingleDisplay(true);
                            }}>
                            <div id='full-data' className='hidden'>
                                {JSON.stringify(e)}
                            </div>
                            <div className='flex gap-5 justify-between w-full'>
                                <div className='col-span-2 text-sm flex w-full justify-between items-start'>
                                    <div className='text-2xl text-orange-400'>{e.name}</div>
                                    {e.is_required && <div className={`text-orange-400 border-3 border-black 
                                text-right rounded-md -translate-y-9  px-2 text-xl font-mono font-black`}
                                        style={
                                            {
                                                backgroundColor: THEME.ACTIVE.bg
                                            }
                                        }
                                    >REQUIRED</div>}
                                </div>
                                <Button {...THEME.ACTIVE} nClick={() => {
                                    di.request.delete(
                                        {
                                            url: di.api.get('classification') + '?id=' + e.id,
                                            callback: (e) => {
                                                if (e.success) {
                                                    toast.success(e.message);
                                                } else {
                                                    toast.error(e.message);
                                                }
                                            }
                                        });
                                }}>
                                    <span className='flex gap-1'>
                                        <RiDeleteBinFill className='text-2xl text-red-700' />
                                    </span>
                                </Button>
                            </div>
                            <div className=''>count: {e.count}</div>
                        </Card>
                    })
                }
            </div>
        </div >
    </div >)
}

const Main = ({ di }) => {
    const [attributes, setData] = useState([]);
    const [cursor, setCursor] = useState(false);

    useEffect(() => {
        loadClassification(di, cursor, false, setData);
    }, [cursor]);
    return (
        <div style={{ backgroundImage: `url('${BG}')` }} className='flex flex-col w-full h-full flex gap-5 justify-center items-center bg-cover bg-center overflow-hidden'>
            <Attributes di={di} setter={setData} attributes={attributes?.data} cursor={cursor}></Attributes>
            <div className='flex'>
                <Button className={`py-2 px-5 ${attributes?.cursor?.prev ? '' : 'opacity-25'}`} {...THEME.ACTIVE} onClick={() => { setCursor(attributes.cursor.prev); }}>
                    <TbTriangleFilled className='-rotate-90 text-yellow-900/75' /></Button>
                <Card className='py-2 px-4' {...THEME.SECONDARY}></Card>
                <Button className={`py-2 px-5 ${attributes?.cursor?.next ? '' : 'opacity-25'}`}{...THEME.ACTIVE} onClick={() => { setCursor(attributes.cursor.next); }}>
                    <TbTriangleFilled className='rotate-90 text-yellow-900/75' /></Button>
            </div>
        </div>
    );
};
export default Main;