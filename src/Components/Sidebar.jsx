/* eslint-disable react/prop-types */
import React from 'react';
import { Bubble, Button, Card } from 'pixel-retroui';
import { THEME } from '@pages/Theme';
import { RiLogoutBoxFill } from "react-icons/ri";

const Sidebar = ({ links = [], di }) => {
    const navigate = (location) => window.location = location;
    return (
        <Card {...THEME.MUDDY} className='h-full w-1/6 flex flex-col gap-4 p-4 overflow-hidden'>
            <Bubble {...THEME.ACTIVE} className='text-2xl text-center' onClick={() => { }}>
                {localStorage.getItem('business_name') ?? "RetroEnd"}
            </Bubble>
            <div className='flex flex-col justify-center overflow-auto grow'>
                <div className='flex flex-col w-full h-full overflow-auto justify-between'>
                    {
                        links.map((e, i) => {
                            if (e.show)
                                if (e.url === window.location.pathname) {
                                    return (
                                        <Card {...THEME.ACTIVE} key={i}>
                                            <p href={e.url} key={i} className='text-black text-center'>{e.text}</p>
                                        </Card>
                                    );
                                } else {

                                    return (
                                        <Button {...THEME.ACTIVE} key={i} onClick={() => {
                                            navigate(e.url)
                                        }}>
                                            <a href={e.url} key={i} className='text-black'>{e.text}</a>
                                        </Button>
                                    )
                                }
                        })
                    }
                </div>
            </div>
            <Button {...THEME.ACTIVE} onClick={() => {
                di.request.get({ url: di.api.get('logout') });
                localStorage.clear();
                navigate('/');
            }} className='flex items-center justify-between px-5'>
                <RiLogoutBoxFill className='text-3xl text-yellow-900/75' />
                <p> Logout</p>
            </Button>
        </Card>
    );
};
export default Sidebar;