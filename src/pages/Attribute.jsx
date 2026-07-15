/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Popup } from 'pixel-retroui';
import { THEME } from './Theme';
import { TbBinaryTree2Filled } from "react-icons/tb";
import { FaAsterisk } from 'react-icons/fa';
import JsonView from '@microlink/react-json-view';
import Scroll from '@components/Scroll';
import Pagination from '@components/Paginator';

const BG = "https://media.licdn.com/dms/image/v2/C5622AQELEjXGaw74OA/feedshare-shrink_800/feedshare-shrink_800/0/1617991168518?e=2147483647&v=beta&t=pZvDdEB_rbXUeYv_cp54DRdnTItrBywdDIqCEXtsuz4";

async function loadAttributes(di, cursor, filter = false, setAttributes, search = null) {
    let attrData;
    // filter = "&filter['is_visible_on_frontend'][1]=true";
    let url = di.api.get('attribute')
        + "?per_page=16"
        + (filter ? `${filter}` : "")
        + (cursor ? `&cursor=${cursor}` : "")
        + ("&options[sort][is_required]=1")
    if (search) {
        url += `&filter[name][3]=${search}`;
        // url += `&or_filter[code][3]=${search}`;
    }
    await di.request.get({
        url: url,
        callback: data => {
            data.data = data.data.sort((a, b) => {
                return a.is_required ? -1 : 1;
            });
            attrData = data;
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
    return (<div className='flex flex-col gap-5 h-full w-128'>
        <div>
            <p className='text-2xl'>Details - {data.name}</p>
        </div>
        <div className='flex justify-center items-center h-128 w-full'>
            <Scroll>
                <JsonView src={data}  theme={THEME.JSON.DEFAULT} />
            </Scroll>
        </div>
    </div>)
}

const Attributes = ({ attributes, setter, di, curosr }) => {
    const [popupOpen, setPopupOpen] = useState(false);
    const [singleDisplay, setSingleDisplay] = useState(false);
    const [filter, setFilter] = useState(0);
    const [singleAttribute, setSingleAttribute] = useState(false);
    const [search, setSearch] = useState(null);
    const filterValues = [
        ['All', false],
        ['Required only', "&and_filter[is_required][1]=1"],
        ['Optional only', "&and_filter[is_required][1]=0"],
    ];
    // Debounce useEffect by 700ms on filter/search
    useEffect(() => {
        const handle = setTimeout(() => {
            attributes = loadAttributes(di, curosr, filterValues[filter][1], setter, search);
        }, 700);
        return () => clearTimeout(handle);
    }, [filter, search]);
    return (<div className='flex justify-start flex-col overflow-hidden items-between gap-5 w-full h-full p-3' {...THEME.SECONDARY}>
        <Popup {...THEME.SECONDARY} isOpen={popupOpen} onClose={() => setPopupOpen(false)}>
            <CreateAttribute />
        </Popup>
        <Popup {...THEME.SECONDARY} isOpen={singleDisplay} onClose={() => setSingleDisplay(false)}>
            <ShowAttribute data={singleAttribute} />
        </Popup>
        <Card {...THEME.SECONDARY} className='flex gap-3 justify-between items-center'>
            <div className='flex grow gap-3 justify-start items-center'>
                <p className='text-2xl'>Attributes</p>
                <p onClick={() => { di.navigate("/attribute/system") }} className='text-blue-400 cursor-pointer text-sm flex flex-col gap-0'>
                    <span >System</span>
                    <span >Attributes</span>
                </p>
                <Button className='min-w-32' {...THEME.ACTIVE} onClick={e => {
                    setFilter((filter + 1) % filterValues.length);
                }} >{filterValues[filter][0]}</Button>
                <Input className='grow' placeholder='Search' {...THEME.ACTIVE_INPUT} onChange={(e) => {
                    setSearch(e.target.value);
                }} />
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
                         rounded-xl px-5 h-full`} {...THEME.SECONDARY}>
                            <div id='full-data' className='hidden'>
                                {JSON.stringify(e)}
                            </div>
                            <div className='col-span-2 text-sm flex w-full justify-start items-start gap-1'>
                                <div className='text-xl text-orange-400 overflow-hidden text-ellipsis whitespace-nowrap'>{e.name}</div>
                                <div onClick={(event) => {
                                    event.stopPropagation();
                                    setSingleAttribute(attributes[event.target.dataset.index]);
                                    setSingleDisplay(true);
                                }} data-index={index} className='text-blue-400 cursor-pointer text-sm'>view</div>
                            </div>
                            <div className='flex justify-between items-center w-full'>
                                <div className='flex flex-col gap-0 justify-start items-start overflow-hidden text-ellipsis whitespace-nowrap'>
                                    <div className=''>Code: {e.code}</div>
                                    <div className=''>Type: {e.type}</div>
                                    <div className=''>In use: {e.in_use ? "Yes" : "No"}</div>
                                </div>
                                <div className={`flex flex-col gap-0 justify-end items-end grow h-full`}>
                                    {e.is_required ? <span className='flex text-red-400 group duration-300 gap-1'><FaAsterisk />
                                        <span className='inline-block overflow-hidden w-0 group-hover:w-24 duration-300'>Required</span>
                                    </span> : ""}
                                    {e.use_for_variation ? <span className='flex text-blue-400 group duration-300 gap-1'><TbBinaryTree2Filled />
                                        <span className='inline-block overflow-hidden w-0 group-hover:w-24 duration-300'>Variation</span>
                                    </span> : ""}
                                </div>
                            </div>
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
    const [page, setPage] = useState(1);

    useEffect(() => {
        loadAttributes(di, cursor, false, setAttributes);
    }, [cursor]);
    return (
        <div style={{ backgroundImage: `url('${BG}')` }} className='flex flex-col w-full h-full flex gap-5 justify-center items-center bg-cover bg-center overflow-hidden'>
            <Attributes di={di} setter={setAttributes} attributes={attributes?.data} cursor={cursor}></Attributes>
            <div className='flex justify-center'>
                <Pagination page={page} setPage={setPage} cursor={attributes?.cursor} setNextCursor={setCursor} />
            </div>
        </div>
    );
};
export default Main;