/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Popup } from 'pixel-retroui';
import { THEME } from './Theme';
import { TbTriangleFilled } from "react-icons/tb";


const BG = "https://media.licdn.com/dms/image/v2/C5622AQELEjXGaw74OA/feedshare-shrink_800/feedshare-shrink_800/0/1617991168518?e=2147483647&v=beta&t=pZvDdEB_rbXUeYv_cp54DRdnTItrBywdDIqCEXtsuz4";

async function loadAttributes(di, cursor, filter = false, setAttributes) {
    let attrData;
    let url = di.api.get('attribute')
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
            setAttributes(data)
        }
    });
    return attrData;
}

const CreateAttribute = () => {
    const fileds = [
        {
            name: 'name',
            type: 'text'
        },
        {
            name: 'additional_data',
            type: 'text'
        },
        {
            name: 'hint',
            type: 'text'
        },
        {
            name: 'is_required',
            type: 'checkbox'
        },
        {
            name: 'code',
            type: 'text'
        },
        {
            name: 'use_for_variation',
            type: 'checkbox'
        },
        {
            name: 'type',
            type: 'text'
        },
        {
            name: 'is_filterable',
            type: 'checkbox'
        },
    ]
    return (
        <div className='flex flex-col justify-center items-start gap-5'>
            <p className='text-2xl'>Create new attribute</p>
            <div className='grid grid-cols-2 gap-5'>
                {
                    fileds.map((field, index) => {
                        return (
                            <div key={index} className='flex justify-between items-center gap-5'>
                                <label className='text-right'>{field.name.toUpperCase()} </label>
                                <div className=''>
                                    <Input {...THEME.ACTIVE_INPUT} placeholder='^-^' className='w-full' type={field.type}></Input>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <Button className='px-5' {...THEME.ACTIVE}>Save</Button>
        </div>
    )
}

const ShowAttribute = ({ data }) => {
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
        loadAttributes(di, curosr, filterValues[filter][1], setter);
    }, [filter]);
    return (<div className='flex justify-start flex-col overflow-hidden items-between gap-5 w-full h-full p-3' {...THEME.SECONDARY}>
        <Popup {...THEME.SECONDARY} isOpen={popupOpen} onClose={() => setPopupOpen(false)}>
            <CreateAttribute />
        </Popup>
        <Popup {...THEME.SECONDARY} isOpen={singleDisplay} onClose={() => setSingleDisplay(false)}>
            <ShowAttribute data={singleAttribute} />
        </Popup>
        <Card {...THEME.SECONDARY} className='flex gap-3 justify-between items-center'>
            <div className='flex gap-3 justify-start items-center'>
                <p className='text-2xl'>Attributes</p>
                <Button className='min-w-32' {...THEME.ACTIVE} onClick={e => {
                    setFilter((filter + 1) % filterValues.length);

                }} >{filterValues[filter][0]}</Button>
            </div>
            <div>
                <Button {...THEME.ACTIVE} onClick={() => {
                    di.request.post({ url: di.api.get('attribute-import', 'catalog') });
                }}>Import</Button>
                <Button {...THEME.ACTIVE} onClick={() => {
                    setPopupOpen(true);
                }}>Create</Button>
            </div>
        </Card>
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
                            <div className='col-span-2 text-sm flex w-full justify-between items-start'>
                                <div className='text-2xl text-orange-900'>{e.name}</div>
                                {(e.is_required || e.use_for_variation) && <div className={`text-orange-900 border-3 border-black 
                                text-right rounded-md -translate-y-9  px-2 text-xl font-mono font-black`}
                                    style={
                                        {
                                            backgroundColor: THEME.ACTIVE.bg
                                        }
                                    }
                                >
                                    {e.is_required?<span className='text-rose-600'>REQUIRED</span>:""}
                                    {e.use_for_variation?<span className='text-brown-700'>VARIATION</span>:""}
                                    </div>}
                            </div>
                            <div className=''>code: {e.code}</div>
                            <div className=''>type: {e.type}</div>
                        </Card>
                    })
                }
            </div>
        </div >
    </div >)
}

const Main = ({ di }) => {
    const [attributes, setAttributes] = useState([]);
    const [cursor, setCursor] = useState(false);

    useEffect(() => {
        loadAttributes(di, cursor, false, setAttributes);
    }, [cursor]);
    return (
        <div style={{ backgroundImage: `url('${BG}')` }} className='flex flex-col w-full h-full flex gap-5 justify-center items-center bg-cover bg-center overflow-hidden'>
            <Attributes di={di} setter={setAttributes} attributes={attributes?.data} cursor={cursor}></Attributes>
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