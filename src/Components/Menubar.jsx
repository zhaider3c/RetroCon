/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, Popup } from 'pixel-retroui';
import { THEME } from '@pages/Theme';
import { RiLogoutBoxFill } from "react-icons/ri";
import Scroll from '@components/Scroll';
import { Link } from 'react-router-dom';
import Marquee from '@components/Marquee';

const Menubar = ({ links = [], di, setTip, setMenuOpen }) => {
    return (
        <div className={`flex flex-col gap-4 p-4 overflow-hidden`}>
            <p className='text-center text-2xl'>Navigation</p>
            <Scroll className='w-full h-full'>
                <div className='h-full justify-between gap-3 grid grid-cols-2' >
                    {
                        links.map((e, i) => {
                            if (e.show) {
                                if ('#' + e.url === window.location.hash) {
                                    setTip(e.tip);
                                    console.log(e.tip);
                                    return (
                                        <Card {...THEME.ACTIVE_BUTTON} key={i}>
                                            <p href={e.url} key={i} className='text-inherit text-center'>{e.text}</p>
                                        </Card>
                                    );
                                } else {
                                    return (
                                        <Button {...THEME.SECONDARY} key={i} onClick={() => {
                                            setMenuOpen(false);
                                            di.navigate(e.url);
                                            setTip(e.tip);
                                        }}>
                                            <Link to={e.url}>{e.text}</Link>
                                        </Button>
                                    )
                                }
                            }
                        })
                    }
                </div>
            </Scroll>
            <div className='w-full flex gap-5 items-center justify-between h-fit'>
                <div className='text-xl text-center h-full' onClick={() => { }}>
                    {localStorage.getItem('business_name') ?? "RetroEnd"}
                </div>
                <Button {...THEME.ACTIVE} onClick={() => {
                    di.request.get({ url: di.api.get('logout') });
                    localStorage.clear();
                    di.navigate('/');
                }} className='flex items-center justify-between px-5 py-3'>
                    <RiLogoutBoxFill className='text-3xl text-yellow-900/75' />
                    <p> Logout</p>
                </Button>
            </div>
        </div>
    );
};

export function Main({ links = [], di }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [tip, setTip] = useState("Have a great day!");
    return (
        <Card {...THEME.SECONDARY} className={`w-full h-16 flex justify-start items-center`}>
            <Popup isOpen={menuOpen} {...THEME.ACTIVE} onClose={() => {
                setMenuOpen(false);
            }}>
                <Menubar links={links} di={di} setMenuOpen={setMenuOpen} setTip={setTip} />
            </Popup>
            <Button className='w-1/12' {...THEME.ACTIVE_BUTTON} onClick={() => {
                setMenuOpen(!menuOpen);
            }}>Menu</Button>
            <Marquee text={tip} className='text-start text-white/75' />
        </Card>
    )
}