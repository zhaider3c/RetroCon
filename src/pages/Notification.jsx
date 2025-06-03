/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Popup } from 'pixel-retroui';
import { THEME } from './Theme';


const BG = "cache-bg.gif";

function loadData(setter, di) {
    (async () => {
        let mainData = {};
        await di.request.get({
            url: di.api.get('notification'),
            callback: data => {
                mainData['notification'] = data.data
            }
        });
        await di.request.get({
            url: di.api.get('announcement'),
            callback: data => {
                mainData['announcement'] = data.data
            }
        });
        await di.request.get({
            url: di.api.get('activity'),
            callback: data => {
                mainData['activity'] = data.data
            }
        });
        return mainData;
    })().then(data => {
        setter(data);
    });
}
const Data = ({ data, di }) => {
    return (<div className='flex justify-start items-between gap-5' {...THEME.MUDDY}>
        <Card className='flex flex-col gap-5 justify-center items-center overflow-auto' {...THEME.POP}>
            <p className='text-2xl'>Activities</p>
            <div className='flex flex-col gap-5'>
                {
                    data && Object.keys(data).map((item, index) => {
                        return (
                            <Card key={index} className={`flex flex-col gap-5 justify-between items-start overflow-hidden max-h-[32em]`} {...THEME.MUDDY} >
                                <p className='text-2xl capitalize'>{item}: {data[item].length}</p>
                                <div className='grid grid-cols-2 gap-5 justify-between items-start overflow-auto' {...THEME.POP}>
                                    {
                                        data[item].map((item, index) => {
                                            return (
                                                <div key={index} className='flex flex-col gap-5 justify-start items-start col-span-1 bg-orange-900/25 p-5 rounded-xl border-2 border-orange-900/75'>
                                                    < p className='text-left' >
                                                        {item.id}:
                                                    </p>
                                                    <div className='flex flex-col gap-5 w-full justify-between items-end'>
                                                        <span>
                                                            {item.message}
                                                        </span>
                                                        <span className=''>
                                                            {/* {item.data && parseInt(item.data.completed) + "," + parseInt(item.data.total)} */}
                                                            {Math.round(item?.data ? (parseInt(item.data.completed) * 100 / parseInt(item.data.total)) : 0)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </Card>

                        )
                    })
                }

            </div>
        </Card >
    </div >)
}

const Main = ({ di }) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        loadData(setData, di);
    }, []);
    return (
        <div style={{ backgroundImage: `url('${BG}')` }} className='w-full flex gap-5 justify-center items-center bg-cover bg-center h-full'>
            <Data di={di} data={data}></Data>
        </div>
    );
};
export default Main;