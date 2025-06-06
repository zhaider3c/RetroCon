/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Popup } from 'pixel-retroui';
import { THEME } from './Theme';


const Main = ({ di }) => {
    const [currency, setCurrency] = useState([]);
    useEffect(() => {
        di.request.get({
            url: di.api.get('currency'), callback: (res) => {
                setCurrency(res.data);
            }
        });
    }, []);
    return (
        <div className='flex flex-col w-full h-full gap-5 justify-center items-center bg-cover bg-center overflow-hidden'>
            <div className='flex gap-5 w-full justify-center h-full items-center overflow-hidden p-5'>
                <Card className='grid h-full w-full  grid-cols-2 gap-5 justify-center items-center overflow-auto' {...THEME.ACTIVE}>
                    <div className='text-center' {...THEME.ACTIVE}>
                        <p className='text-2xl'>Currencies</p>
                    </div>
                    {
                        currency && currency.map((e, i) => {
                            return (
                                <Card key={i} {...THEME.MUDDY} className='flex flex-col'>
                                    {Object.keys(e).map((x, j) => {
                                        return (
                                            <div key={j} className='flex gap-5 justify-between'>
                                                <p >{x}</p>
                                                <p >{e[x]}</p>
                                            </div>
                                        )
                                    })
                                    }

                                </Card>
                            )
                        })
                    }
                </Card>
            </div>
        </div >
    )
}
export default Main;