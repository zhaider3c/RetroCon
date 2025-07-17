/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, Popup } from 'pixel-retroui';
import { THEME } from '@pages/Theme';
import { RiLogoutBoxFill } from "react-icons/ri";
import Scroll from '@components/Scroll';
import { Link } from 'react-router-dom';
import Marquee from '@components/Marquee';
import menuIcon from '@assets/menu.svg';
import '@assets/Menubar.css';

const Menubar = ({ links = [], di, setTip, setMenuOpen }) => {
    return (
        <div className={`flex flex-col gap-4 p-4 overflow-hidden h-full`}>
            <p className='text-center text-2xl'>Navigation</p>
            <Scroll className='w-full h-full'>
                <div className='h-full justify-between gap-3 grid grid-cols-2' >
                    {
                        links.map((e, i) => {
                            if (e.show) {
                                if ('#' + e.url === window.location.hash) {
                                    return (
                                        <Card {...THEME.SUCCESS} key={i}>
                                            <p href={e.url} key={i} className='text-inherit text-center'>{e.text}</p>
                                        </Card>
                                    );
                                } else {
                                    return (
                                        <Button {...THEME.ACTIVE} key={i} onClick={() => {
                                            localStorage.setItem('tip', e.tip ?? "Have a nice day!");
                                            setMenuOpen(false);
                                            di.navigate(e.url);
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
            <div className='w-full grid grid-cols-2 gap-5 items-center justify-center'>
                <Card {...THEME.ACTIVE} className='cursor-pointer text-xl text-center h-full w-full col-span-2 flex items-center justify-between' onClick={() => {
                    setMenuOpen(false);
                    di.navigate('/profile');
                }}>
                    <div className='rounded-xl flex items-center justify-center text-2xl grow bg-black/50 h-full'>
                        {(localStorage.getItem('business_name') ?? "RetroEnd").charAt(0).toUpperCase()}
                    </div>
                    <div className='flex flex-col items-center justify-between px-5 py-3'>
                        <p className='text-xl w-full text-start'>
                            {localStorage.getItem('business_name') ?? "RetroEnd"}
                        </p>
                        <span className='text-sm text-white/25 w-full text-start'> Profile </span>
                    </div>
                    <Button {...THEME.DANGER} onClick={() => {
                        localStorage.clear();
                        di.request.get({ url: di.api.get('logout') });
                        setMenuOpen(false);
                        di.navigate('/login');
                    }} className='flex items-center justify-between px-5 py-3 col-span-1'>
                        <RiLogoutBoxFill className='text-3xl text-white' />
                        {/* <p>Logout</p> */}
                    </Button>
                </Card>
            </div>
        </div>
    );
};

export function Main({ links = [], di }) {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <div className='w-full h-16 p-0 flex gap-0 overflow-hidden justify-between'>
            <div id='menu-button' className='w-1/12 h-full text-center px-3 font-black text-2xl flex items-center justify-center bg-contain bg-repeat-x bg-start'
                style={{
                    backgroundColor: THEME.SUCCESS_DARK.bg,
                    color: THEME.SUCCESS_DARK.textColor,
                    borderColor: THEME.SUCCESS_DARK.borderColor,
                    boxShadow: THEME.SUCCESS_DARK.shadowColor,
                    border: "outset 5px " + THEME.SUCCESS_DARK.borderColor,
                }}
                onMouseEnter={() => {
                    document.getElementById('menu-button').classList.add('shiny');
                }}
                onMouseLeave={() => {
                    document.getElementById('menu-button').classList.remove('shiny');
                }}
                onClick={() => {
                    setMenuOpen(!menuOpen);
                }}>
                <div className='flex flex-col items-end justify-center gap-2 text-end w-full'>
                    <span className='text-xl w-full text-start'>Menu</span>
                    <span className='text-sm text-green-950'> Ctrl + B</span>
                </div>
            </div>
            <div className={`grow h-full p-0 flex justify-start items-center gap-0`}
                style={{
                    backgroundColor: THEME.SECONDARY.bg,
                    color: THEME.SECONDARY.textColor,
                    borderColor: THEME.SECONDARY.borderColor,
                    boxShadow: THEME.SECONDARY.shadowColor,
                }}>
                <Card style={{
                    transform: menuOpen ? 'translateX(0px)' : 'translateX(-100%)',
                    transition: 'transform 0.3s ease-in-out',
                    borderLeft: 'none',
                    borderBottom: 'none',
                    borderTop: 'none',
                    margin: '0px',
                }}
                    onBlur={() => {
                        setMenuOpen(false);
                    }}
                    {...THEME.SECONDARY} className={`absolute bottom-17 -left-2 top-0 duration-300`}>
                    <Menubar links={links} di={di} setMenuOpen={setMenuOpen} />
                </Card>
                <Marquee text={localStorage.getItem('tip') ?? "Have a great day!"} className='text-start text-white/75' />
            </div>
        </div>
    )
}