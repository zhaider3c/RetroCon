/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Popup } from 'pixel-retroui';
import { THEME } from './Theme';


const BG = "cache-bg.gif";

function loadData(setter, di) {
    (async () => {
        let apiData = {};
        await di.request.get({
            url: di.api.get('cache-list') + "?type=queue",
            callback: data => {
                apiData.unicon = data.data;
            }
        });
        await di.request.get({
            url: di.api.get('cache-list', 'catalog') + "?type=queue",
            callback: data => {
                apiData.catalog = data.data;
            }
        });
        return apiData;
    })().then((data) => {
        setter(data);
    })
}
const Show = ({ id, di }) => {
    const [data, setData] = useState("NO");
    useEffect(() => {
        di.request.get({
            url: di.api.get('cache') + `?key=${id}&type=queue`, callback: apiData => {
                console.log(data);
                setData({ ...data, unicon: apiData.data }, null, 2);
            }
        });
        di.request.get({
            url: di.api.get('cache', 'catalog') + `?key=${id}&type=queue`, callback: apiData => {
                console.log(data);
                setData({ ...data, catalog: apiData.data }, null, 2);
            }
        })
    }, []);
    return (
        <div className='h-full w-full overflow-hidden justify-center items-center'>
            <pre className='h-full overflow-auto w-full text-pretty break-all'>
                {
                    JSON.stringify(data, null, 2)
                }
            </pre>
        </div>
    )
}
const Cache = ({ data, di }) => {
    const [popupOpen, setPopupOpen] = useState(false);
    const [key, setKey] = useState(false);
    return (<div className='flex justify-center items-center gap-5' {...THEME.MUDDY}>
        <Popup {...THEME.MUDDY} isOpen={popupOpen} onClose={() => setPopupOpen(false)}>
            <div className='w-[90em] overflow-hidden h-[50em]'>
                <Show di={di} id={key} />
            </div>
        </Popup>
        <Card className='flex flex-col gap-5 justify-center items-center overflow-auto' {...THEME.ACTIVE}>
            <p className='text-2xl'>Queues</p>
            <div className='flex flex-col'>
                {
                    data.catalog && Object.keys(data.catalog).map((item, index) => {
                        return (<Card key={index} className={`flex flex-col gap-5 justify-between items-start`} {...THEME.MUDDY} onClick={() => {
                            setPopupOpen(true);
                            setKey(item);
                        }}>
                            <p>{item}</p>
                        </Card>
                        )
                    })
                }
            </div>
            <div className='flex flex-col'>
                {
                    data.unicon && Object.keys(data.unicon).map((item, index) => {
                        return (<Card key={index} className={`flex flex-col gap-5 justify-between items-start`} {...THEME.MUDDY} onClick={() => {
                            setPopupOpen(true);
                            setKey(item);
                        }}>
                            <p>{item}</p>
                        </Card>
                        )
                    })
                }

            </div>
        </Card>
    </div>)
}

const Main = ({ di }) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        loadData(setData, di);
    }, []);
    return (
        <div style={{ backgroundImage: `url('${BG}')` }} className='w-full h-full flex gap-5 justify-center items-center bg-cover bg-center'>
            <Cache di={di} data={data}></Cache>
        </div>
    );
};
export default Main;