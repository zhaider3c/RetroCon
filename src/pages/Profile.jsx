/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Card, TextArea } from 'pixel-retroui';
import { THEME } from './Theme';
import ReactJson from '@microlink/react-json-view';
import Scroll from '@components/Scroll';
import BG from '@assets/profile-bg.png';

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
        <div className='w-full h-full flex flex-col gap-5 justify-center items-center bg-cover bg-center' style={{ backgroundImage: `url(${BG})` }}>
            <div className='w-full h-16 flex flex-row-reverse gap-3 justify-start items-center bg-black/75 backdrop-blur-sm! text-white p-5'>
                <p className='text-xl'>{user.organisation_name}</p>
            </div>
            <div className='w-full grow'>
        
            </div>
        </div >
    )
}