/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Popup } from 'pixel-retroui';
import { THEME } from './Theme';
import BG from '@assets/cache-bg.gif';
import ReactJson from '@microlink/react-json-view';
import Scroll from '@components/Scroll';
import { FaTrashAlt } from 'react-icons/fa';
import Wave from '@assets/cat_z.gif';
import { FiRefreshCcw } from 'react-icons/fi';


const Cache = ({ di, setKey, index, data, setRefresh, refresh }) => {
    const [search, setSearch] = useState(null);

    const render = data && Object.keys(data).length > 0
    return (
        <div className='flex justify-center items-center gap-5' {...THEME.SECONDARY}>
            <Card className='flex flex-col gap-3 justify-center items-start overflow-auto h-96' {...THEME.ACTIVE}>
                {render && <div className='flex justify-between w-full items-center gap-5'>
                    <p className='text-2xl w-fit'>Queues</p>
                    <Input {...THEME.SECONDARY} className='h-8 grow items-center text-center justify-center flex' placeholder='Search Queue' onChange={(e) => {
                        setSearch(e.target.value);
                    }} />
                </div>}
                <Scroll className='h-128'>
                    <div className='flex flex-col gap-1'>
                        {
                            render ? Object.keys(data).filter(item => !search || item.includes(search)).filter(item => data[item] && data[item].length > 0).map((item, idx) => {
                                if (item.includes('_ID_')) {
                                    return null;
                                }
                                return (
                                    <Card data-service='unicon' data-key={item} key={idx} className={`flex flex-col gap-5 justify-between items-center`} {...(item == index ? THEME.SUCCESS : THEME.SECONDARY)} onClick={(e) => {
                                        setKey(item);
                                        di.clipboard.copy(`unicon w:add ${item}`);
                                    }} >
                                        <p className='pointer-events-none'>
                                            {item} : {data[item].length}
                                        </p>
                                    </Card>
                                )
                            }) :
                                <div className='flex flex-col p-0 justify-center items-center rounded-xl overflow-hidden'>
                                    <div className='flex justify-between items-center'>
                                        <p className='text-2xl py-5 px-3'>No queues found</p>
                                        <Button {...THEME.SEAMLESS} onClick={() => {
                                            setRefresh(refresh + 1);
                                        }}>
                                            <FiRefreshCcw className='text-2xl text-green-500' />
                                        </Button>
                                    </div>
                                    <img src={Wave} alt="Wave" className='w-64 h-auto bg-black rounded-xl' />
                                </div>
                        }

                    </div>
                </Scroll>
            </Card>
        </div>)
}

const Messages = ({ di, index, data, setSingle }) => {
    const [popupOpen, setPopupOpen] = useState(false);
    const [key, setKey] = useState(null);
    return (
        <Card className='flex flex-col gap-5 justify-center items-start h-64' {...THEME.ACTIVE}>
            <div>
                Messages
            </div>
            <Scroll className='w-full'>
                <div className='grid grid-cols-2 gap-1 w-full'>
                    {
                        Object.keys(data).filter(item => item.startsWith(index) && item.includes('_ID_')).map((item, idx) => {
                            return (
                                <Button key={idx} {...THEME.SECONDARY} data-key={item} onClick={(e) => {
                                    setKey(e.target.dataset.key);
                                    setSingle(data[e.target.dataset.key]);
                                    setPopupOpen(true);
                                }}>
                                    <p className='pointer-events-none'>{item.split('-').pop()}</p>
                                </Button>
                            )
                        })
                    }
                </div>
            </Scroll>
        </Card>
    )
}

const Single = ({ data }) => {
    return (
        <div className='w-fit overflow-hidden h-164'>
            <Scroll>
                <ReactJson src={data} theme={THEME.JSON.DEFAULT} name={null} displayObjectSize={false} displayDataTypes={false} />
            </Scroll>
        </div>
    )
}

const ToolBox = ({ di, setRefresh, refresh }) => {
    return (
        <Card className='flex justify-between items-center gap-2 h-fit' {...THEME.SECONDARY}>
            <p className='text-2xl'>Local Queue</p>
            <div className='flex justify-center items-center gap-5 px-5'>
                <button onClick={() => {
                    (async () => {
                        await di.request.get({
                            url: di.api.get('cache-flush') + "?type=queue"
                        });
                        // await di.request.get({
                        //     url: di.api.get('cache-flush', 'catalog') + "?type=queue"
                        // });
                    })().then(() => {
                        setRefresh(refresh + 1);
                    });
                }} className='flex justify-center items-center gap-2'>
                    <FaTrashAlt className='text-2xl text-red-500 hover:text-red-700' />
                </button>
                <button onClick={() => {
                    setRefresh(refresh + 1);
                }}>
                    <FiRefreshCcw className='text-2xl text-green-500' />
                </button>
            </div>
        </Card>)
}
const Main = ({ di }) => {
    const [key, setKey] = useState({});
    const [data, setData] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const [single, setSingle] = useState(null);
    useEffect(() => {
        setData(null);
        setKey(null);
        setSingle(null);
        (() => {
            di.request.get({
                url: di.api.get('cache') + "?type=queue",
                callback: data => {
                    setData(prev => ({ ...prev, ...data.data }));
                }
            })
            di.request.get({
                url: di.api.get('cache', 'catalog') + "?type=queue",
                callback: data => {
                    setData(prev => ({ ...prev, ...data.data }));
                }
            });
        })()
    }, [refresh]);
    return (
        <div style={{ backgroundImage: `url(${BG})` }} className='w-full h-full gap-5 flex flex-row-reverse justify-center items-start bg-cover bg-center p-5'>
            {single && <Card {...THEME.ACTIVE}>
                <Single data={single} />
            </Card>}
            <div className='flex flex-col gap-5 w-fit h-196'>
                <ToolBox di={di} setRefresh={setRefresh} refresh={refresh} />
                <div>
                    {data && <Cache di={di} setKey={setKey} index={key} setRefresh={setRefresh} refresh={refresh} data={data} />}
                    {key && data && <Messages di={di} index={key} data={data} setSingle={setSingle} />}
                </div>
            </div>
        </div>
    );
};
export default Main;