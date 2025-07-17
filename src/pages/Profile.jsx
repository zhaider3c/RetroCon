/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Card, TextArea } from 'pixel-retroui';
import { THEME } from './Theme';
import ReactJson from '@microlink/react-json-view';

export default function Profile({ di }) {
    const [business, setBusiness] = useState({});
    const [user, setUser] = useState(localStorage.getItem('user') ?? {});
    useEffect(() => {
        di.request.get({
            url: di.api.get('business'), callback: r => {
                setBusiness(r.data);
            }
        });
        di.request.get({
            url: di.api.get('user'), callback: r => {
                setUser(r.data);
            }
        });
    }, []);
    return (
        <div className='w-full h-full flex gap-5 justify-center items-center bg-linear-to-r from-purple-900 to-red-300'>
            <Card {...THEME.SECONDARY} className=''>
                <p>Business</p>
                <div className='w-full'>
                    <ReactJson src={business} theme='monokai' />
                </div>
            </Card>
            <Card {...THEME.SECONDARY}>
                <p>User</p>
                <div className='w-full'>
                    <ReactJson src={user} theme='monokai' />
                </div>
            </Card>
        </div>
    )
}