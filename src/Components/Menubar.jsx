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
        <div className={`flex flex-col gap-4 p-4 overflow-hidden`}>
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
                <div className='text-xl text-center h-full col-span-1' onClick={() => { }}>
                    {localStorage.getItem('business_name') ?? "RetroEnd"}
                </div>
                <Button {...THEME.DANGER} onClick={() => {
                    localStorage.clear();
                    di.request.get({ url: di.api.get('logout') });
                    setMenuOpen(false);
                    di.navigate('/login');
                }} className='flex items-center justify-between px-5 py-3 col-span-1'>
                    <RiLogoutBoxFill className='text-3xl text-white' />
                    <p>Logout</p>
                </Button>
            </div>
        </div>
    );
};

export function Main({ links = [], di }) {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <div className='w-full h-16 p-0 flex gap-0 overflow-hidden justify-between'>
            <div id='menu-button' className='w-1/12 h-full text-center px-3 font-black text-2xl flex items-center justify-center'
                style={{
                    backgroundColor: THEME.SUCCESS_DARK.bg,
                    color: THEME.SUCCESS_DARK.textColor,
                    borderColor: THEME.SUCCESS_DARK.borderColor,
                    boxShadow: THEME.SUCCESS_DARK.shadowColor,
                    border: "outset 5px " + THEME.SUCCESS_DARK.borderColor,
                }}
                onClick={() => {
                    setMenuOpen(!menuOpen);
                }}>
                    <img src={menuIcon} alt="Menu" className='w-1/2 h-1/2 opacity-65' />
                    <p className='text-2xl'>Menu</p>
                </div>
            <div className={`grow h-full p-0 flex justify-start items-center gap-0`}
                style={{
                    backgroundColor: THEME.SECONDARY.bg,
                    color: THEME.SECONDARY.textColor,
                    borderColor: THEME.SECONDARY.borderColor,
                    boxShadow: THEME.SECONDARY.shadowColor,
                }}>
                {  /* <Popup isOpen={menuOpen} {...THEME.ACTIVE} onClose={() => {
                setMenuOpen(false);
                }}>
                <Menubar links={links} di={di} setMenuOpen={setMenuOpen} />
                </Popup> */}
                <Card className={`${menuOpen ? 'block' : 'hidden'} absolute bottom-16 left-0`} {...THEME.SECONDARY}>
                    <Menubar links={links} di={di} setMenuOpen={setMenuOpen} />
                </Card>
                <Marquee text={localStorage.getItem('tip') ?? "Have a great day!"} className='text-start text-white/75' />
            </div>
        </div>
    )
}