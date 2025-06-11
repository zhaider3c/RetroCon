/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Popup } from 'pixel-retroui';
import { THEME } from './Theme';
import Scroll from '../Components/Scroll';


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
        <div className='flex flex-col w-full h-full gap-5 justify-center items-center bg-cover bg-center overflow-hidden bg-[url("/map.jpg")]'>
            <div className='flex gap-5 justify-center h-full items-center overflow-hidden p-5'>
                <Card className='flex gap-5 w-full overflow-hidden h-full' {...THEME.SECONDARY}>
                    <Scroll className='grid h-full grid-cols-1 gap-5 justify-center items-center' {...THEME.ACTIVE}>
                        <div className='text-center' {...THEME.ACTIVE}>
                            <p className='text-2xl'>Countries</p>
                        </div>

                        {
                            country && country.map((e, i) => {
                                return (
                                    <Card key={i} {...THEME.ACTIVE} className='flex flex-col'>
                                        <p className='text-xl text-amber-900'>{e.label}</p>
                                        <p>Currency: {(e.currency?.currency_code) ?? "No Currency"}</p>
                                    </Card>
                                )
                            })
                        }
                    </Scroll>
                    <Scroll className='grid h-full grid-cols-1 gap-5 justify-center items-center' {...THEME.ACTIVE}>
                        <div className='text-center' {...THEME.ACTIVE}>
                            <p className='text-2xl'>States</p>
                        </div>
                        {
                            states && states.map((e, i) => {
                                return (
                                    <Card key={i} {...THEME.ACTIVE} className='grid grid-cols-3'>
                                        <p className='text-xl text-amber-900'>{e.country_name}</p>
                                        {
                                            e.states.map((f, j) => {
                                                return (
                                                    <p key={j} className='text-center'>{f.label}</p>
                                                )
                                            })
                                        }
                                    </Card>
                                )
                            })
                        }
                    </Scroll>
                </Card>
            </div>
        </div >
    )
}
export default Main;