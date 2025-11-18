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

const Menubar = ({ links = [], di, setTip, setMenuOpen, pages = [], onPageSelected = (code) => {
    console.log('Page selected: ', code);
} }) => {
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
            <div className='w-full grid grid-cols-2 gap-5 items-end justify-center'>
                <Card {...THEME.ACTIVE} className='cursor-pointer text-xl text-center h-fit w-full col-span-2 flex items-center justify-between' >
                    <div className='h-full grow flex items-center justify-between'
                        onClick={() => {
                            setMenuOpen(false);
                            di.navigate('/profile');
                        }}>
                        <div className='rounded-xl flex items-center justify-center text-2xl w-16 h-16 bg-black/50'>
                            {(localStorage.getItem('business_name') ?? "Unknown Business").charAt(0).toUpperCase()}
                        </div>
                        <div className='flex flex-col grow items-center justify-between px-5 py-3'>
                            <p className='text-xl w-full text-start overflow-hidden text-ellipsis whitespace-nowrap'>
                                {localStorage.getItem('business_name') ?? "Unknown Business"}
                            </p>
                            <span className='text-sm text-white/25 w-full text-start'> Profile </span>
                        </div>
                    </div>
                    <Button {...THEME.DANGER} onClick={() => {
                        // di.request.get({ url: di.api.get('logout') }); This will redirect to SSO Login page.
                        let hosts = localStorage.getItem('hosts')
                        localStorage.clear();
                        localStorage.setItem('hosts', hosts);
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

export function Main({ links = [], di, pages = [], setActivePage, activePage = pages[0] }) {
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
            <div className={`grow h-full p-0 flex justify-start items-center gap-3`}
                style={{
                    backgroundColor: THEME.SECONDARY.bg,
                    color: THEME.SECONDARY.textColor,
                    borderColor: THEME.SECONDARY.borderColor,
                    boxShadow: THEME.SECONDARY.shadowColor,
                }}>
                <div
                    className={`absolute bottom-16 -left-0 top-0 duration-300 backdrop-blur-sm! w-screen bg-black/25`}
                    style={
                        {
                            opacity: menuOpen ? 1 : 0,
                            transition: 'all 0.3s ease-in-out',
                            pointerEvents: menuOpen ? 'auto' : 'none',
                        }
                    }
                    onClick={() => {
                        setMenuOpen(false);
                    }
                    }>
                    <Card style={{
                        borderLeft: 'none',
                        borderBottom: 'none',
                        borderTop: 'none',
                        margin: '0px',
                        transform: menuOpen ? 'translateX(0px)' : 'translateX(-100%)',
                        transition: 'all 0.3s ease-in-out',
                    }}
                        className={`w-fit h-full`}
                        onBlur={() => {
                            setMenuOpen(false);
                        }}
                        {...THEME.SECONDARY} >
                        <Menubar links={links} di={di} setMenuOpen={setMenuOpen} />
                    </Card>
                </div>

                <Marquee text={localStorage.getItem('tip') ?? "Have a great day!"} className='text-start text-white/75' />
                <div className='grow flex gap-5'>
                    {
                        pages.map((page) => {
                            return <Button key={page.label}
                                data-label={page.label}
                                onClick={(e) => setActivePage(pages.find(p => p.label === e.target.dataset.label))}
                                className="w-fit"
                                {...(activePage.label === page.label ? THEME.SUCCESS : THEME.SECONDARY)}
                            >
                                {page.label}
                            </Button>
                        })
                    }
                </div>
                <div className='flex flex-col items-end justify-center gap-0 bg-zinc-700 px-5 rounded-s-xl h-full'>
                    <span>
                        {localStorage.getItem('business')}
                    </span>
                    <span>
                        {di.getUser().organisation_name}
                    </span>
                </div>
            </div>
        </div>
    )
}