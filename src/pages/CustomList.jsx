/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Popup } from 'pixel-retroui';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from 'pixel-retroui';

import { THEME } from './Theme'
import toast from 'react-hot-toast';
import { FaHamburger } from 'react-icons/fa';
import bgCList from '../assets/bg-cList.gif';

const Create = ({ di, listData = false }) => {
    const [data, setData] = useState({});
    const [hash, setHash] = useState(null);
    const [mediaPath, setMediaPath] = useState(null);
    if (listData && !data.name) {
        di.request.get({
            url: di.api.get('media') + `?id=${listData.additional_data.media_id}`, callback: r => {
                setMediaPath(r.data.additional_data.real_name ?? "Not_dound");
            }
        })
        setData({
            name: listData.name,
            columns: listData.column_count,
            id: listData.id
        });
    }
    return (
        <div className='flex flex-col justify-center items-start gap-5'>
            <h1 className='text-2xl'>{listData ? listData.id : 'Create a new list'}</h1>
            <div className='flex gap-5'>
                <Input {...THEME.ACTIVE_INPUT} type="text" value={data.name ?? listData?.name} placeholder="Name" className='h-full' onChange={(e) => {
                    setData({ ...data, name: e.target.value });
                }} />
                <DropdownMenu>
                    <DropdownMenuTrigger {...THEME.ACTIVE}>
                        Columns:{data.columns ?? listData.columns}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent {...THEME.ACTIVE} className='flex gap-5'>
                        {
                            [1, 2].map((x, i) => {
                                return <DropdownMenuItem key={i}
                                    className={'text-center grow flex' + ` hover:bg-[${THEME.ACTIVE.bg}]`}
                                ><Button className='grow' {...THEME.ACTIVE} onClick={() => {
                                    setData({ ...data, columns: x })
                                }}>{x}</Button>
                                </DropdownMenuItem>
                            })
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div>
                <Input {...THEME.ACTIVE_INPUT} type="file" onChange={(e) => {
                    let formData = new FormData();
                    formData.append('file', e.target.files[0]);
                    di.request.get({
                        url: di.api.get('get-upload-url', 'catalog') + `?media_type=local-storage&access=private`, 
                        callback: r => {
                            // Remove Content-Type so browser sets correct boundary for multipart/form-data
                            di.request.post({
                                url: r.url, 
                                body: formData, 
                                headers: { 
                                    'Accept': 'application/json'
                                    // Do NOT set 'Content-Type' here!
                                }, 
                                callback: re => {
                                    toast.success('Image uploaded successfully');
                                    setHash(re.hash);
                                }
                            });
                        }
                    })
                }}
                />
            </div>
            <div className='flex flex-col justify-end w-full items-end'>
                {mediaPath && <a className='grow' src="#" onClick={() => {
                    di.request.get({
                        url: di.api.get('get-download-url', 'catalog') + `?media_id=${listData.additional_data.media_id}`, callback: r => {
                            di.navigate(r.data.url)
                        }
                    })
                }}>Download {mediaPath?.split('/').splice(-1)}</a>}
                <div className='grid grid-cols-4 w-full justify-end items-end'>
                    <Button {...THEME.ACTIVE} className='px-5 col-span-1' onClick={() => {
                        let postData = JSON.stringify({ ...data, "hash": hash });
                        di.request.post({
                            url: di.api.get('custom-list', 'catalog'), body: postData, callback: r => {
                                toast.success(r.message);
                            }
                        });
                    }}>Save</Button>
                    {
                        listData && <Button {...THEME.ACTIVE} className='px-5' onClick={() => {
                            di.request.delete({
                                url: di.api.get('custom-list') + `?id=${listData.id}`, callback: r => {
                                    toast.success(r.message);
                                }
                            });
                        }}>Delete</Button>
                    }
                </div>
            </div>
        </div >
    )
}

const CustomList = ({ di }) => {
    const [cList, setCList] = useState([]);
    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedList, setSelectedList] = useState(false);

    const loadLists = (filter = false) => {
        di.request.get({
            url: di.api.get('custom-list', 'catalog') + (filter ? `?filter[name][3]=${filter}` : ""), callback: r => {
                setCList(r.data);
            }
        });
    }

    useEffect(() => {
        if (cList.length <= 0) {
            loadLists();
        }
    }, []);
    return (
        <div className={`flex flex-col justify-center items-center w-full h-full bg-cover bg-center bg-no-repeat`}
            style={{ backgroundImage: `url(${bgCList})` }}>
            <div className='flex flex-col justify-center items-between gap-5'>
                <Popup {...THEME.SECONDARY} isOpen={popupOpen} onClose={() => setPopupOpen(false)}>
                    <Create di={di} listData={selectedList} />
                </Popup>
                <Card
                    {...THEME.SECONDARY}
                    className='text-2xl flex justify-between items-center gap-5'>
                    Custom Lists
                    <Input {...THEME.ACTIVE_INPUT} onChange={e => {
                        loadLists(e.target.value);
                    }} placeholder='Search' />
                    <div>
                        <Button onClick={() => {
                            setSelectedList(false);
                            setPopupOpen(true)
                        }}>+</Button>
                    </div>
                </Card>
                <Card
                    {...THEME.SECONDARY}
                    className='min-h-96 flex flex-col justify-start items-beetween gap-5'>
                    {
                        <table>
                            <thead>
                                <tr>
                                    <th className='px-3'>Name</th>
                                    <th className='px-3'>Created</th>
                                    <th className='px-3'>Updated</th>
                                </tr>
                            </thead>
                            {cList && cList.map((b, index) => {
                                return <tr key={index}>
                                    <td className='px-3'>
                                        {b.name}
                                    </td>
                                    <td className='px-3'>
                                        {di.formatTime(b.created_at)}
                                    </td>
                                    <td className='px-3'>
                                        {di.formatTime(b.updated_at)}
                                    </td>
                                    <td>
                                        <div className='px-5 py-3' onClick={() => {
                                            setSelectedList(b);
                                            setPopupOpen(true);
                                        }}>
                                            <FaHamburger className='hover:text-amber-700 cursor-pointer' />
                                        </div>
                                    </td>
                                </tr>
                            })}
                        </table>
                    }
                </Card>
            </div>
        </div >
    );
};
export default CustomList;