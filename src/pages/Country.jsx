/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Popup } from 'pixel-retroui';
import { THEME } from './Theme';
import Scroll from '@components/Scroll';
import BG from '@assets/map.jpg';


const Main = ({ di }) => {
    const [country, setCountry] = useState([]);
    const [states, setStates] = useState([]);
    const [currency, setCurrency] = useState([]);
    useEffect(() => {
        di.request.get({
            url: di.api.get('country'), callback: (res) => {
                setCountry(res.data);
            }
        });
    }, []);
    useEffect(() => {
        di.request.get({
            url: di.api.get('state'), callback: (res) => {
                setStates(res.data);
            }
        });
    }, []);
    return (
        <div className='flex flex-col w-full h-full gap-5 justify-center items-center bg-cover bg-center overflow-hidden px-5' style={{ backgroundImage: `url(${BG})` }}>
            <div className='flex gap-5 justify-center h-196 items-center overflow-hidden p-0'>
                <div className='flex gap-5 w-full overflow-hidden h-full' {...THEME.SECONDARY}>
                    <Scroll className='h-full flex flex-col gap-5 justify-start items-center' {...THEME.ACTIVE}>
                        <div className='w-full flex justify-start items-center'>
                            <Card {...THEME.ACTIVE} className='w-full text-start'>
                                <p className='text-2xl'>Countries</p>
                            </Card>
                        </div>
                        {
                            country && country.map((e, i) => {
                                return (
                                    <div className='w-full flex justify-start items-center'>
                                        <Card key={i} {...THEME.ACTIVE} className='flex flex-col w-full'>
                                            <p className='text-xl text-orange-400'>{e.label}</p>
                                            <p>Currency: {(e.currency?.currency_code) ?? "No Currency"}</p>
                                        </Card>
                                    </div>
                                )
                            })
                        }
                    </Scroll>
                        <Scroll className='grid h-full grid-cols-1 gap-5 justify-center items-center' {...THEME.ACTIVE}>
                            <div className='w-full flex justify-start items-center'>
                                <Card {...THEME.ACTIVE} className='w-full text-start'>
                                    <p className='text-2xl'>States</p>
                                </Card>
                            </div>
                            {
                                states && states.map((e, i) => {
                                    return (
                                        <div className='w-full flex justify-start items-center'>
                                            <Card key={i} {...THEME.ACTIVE} className='w-full grid grid-cols-3 justify-start items-center'>
                                                <p className='text-xl text-orange-400'>{e.country_name}</p>
                                                {
                                                    e.states.map((f, j) => {
                                                        return (
                                                            <p key={j} className='text-start'>{f.label}</p>
                                                        )
                                                    })
                                                }
                                            </Card>
                                        </div>
                                    )
                                })
                            }
                        </Scroll>
                </div>
            </div>
        </div >
    )
}
export default Main;