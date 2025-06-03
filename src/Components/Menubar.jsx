/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Bubble, Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from 'pixel-retroui';
import { THEME } from '@pages/Theme';
import { RiLogoutBoxFill } from "react-icons/ri";
import Scroll from '@components/Scroll';

const Menubar = ({ links = [], di }) => {
    const navigate = (location) => window.location = location;
    return (
        <Card {...THEME.MUDDY} className='h-3/4 flex flex-col gap-4 p-4 overflow-hidden p-0 m-0'>
            <Scroll className='w-full h-full'>
                <Card className='h-full justify-between gap-3 grid grid-cols-2' {...THEME.GRAY} >
                    {
                        links.map((e, i) => {
                            if (e.show)
                                if (e.url === window.location.pathname) {
                                    return (
                                        <Card {...THEME.MUDDY} key={i}>
                                            <p href={e.url} key={i} className='text-black text-center'>{e.text}</p>
                                        </Card>
                                    );
                                } else {
                                    return (
                                        <Button {...THEME.POP} key={i} onClick={() => {
                                            navigate(e.url)
                                        }}>
                                            <a href={e.url} key={i} className='text-black'>{e.text}</a>
                                        </Button>
                                    )
                                }
                        })
                    }
                </Card>
            </Scroll>
            <div className='w-full flex gap-5 items-center justify-between h-fit'>
                <div className='text-xl text-center h-full' onClick={() => { }}>
                    {localStorage.getItem('business_name') ?? "RetroEnd"}
                </div>
                <Button {...THEME.POP} onClick={() => {
                    di.request.get({ url: di.api.get('logout') });
                    localStorage.clear();
                    navigate('/');
                }} className='flex items-center justify-between px-5 py-3'>
                    <RiLogoutBoxFill className='text-3xl text-yellow-900/75' />
                    <p> Logout</p>
                </Button>
            </div>
        </Card>
    );
};

export function Main({ links = [], di }) {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <Card {...THEME.MUDDY} className={`w-full h-16 flex justify-start items-center`}>
            <Button className='px-5' onClick={() => {
                setMenuOpen(!menuOpen);
            }}>Menu</Button>
            <div className={`${menuOpen ? '' : 'hidden'} fixed bottom-16 left-0 h-fit h-max-[75%] bg-black/50`}>
                <Menubar links={links} di={di} />
            </div>
        </Card>
    )
}