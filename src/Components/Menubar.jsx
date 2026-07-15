/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { THEME } from '@pages/Theme';
import Marquee from '@components/Marquee';
import NavDrawer from '@components/NavDrawer';
import '@assets/Menubar.css';


export function Main({ links = [], di, pages = [], setActivePage, activePage = pages[0] }) {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'b' && e.ctrlKey) {
                e.preventDefault();
                setMenuOpen((prev) => !prev);
            }
        };
        document.body.addEventListener('keydown', handleKeyDown);
        return () => document.body.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className='w-full h-16 shrink-0 p-0 flex gap-0 overflow-hidden justify-between'>
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
            <Card
                className='retroui-scope flex-row !rounded-none grow h-full p-0 pl-4 justify-start items-center gap-3'
                style={{
                    '--card': THEME.SECONDARY.bg,
                    '--card-foreground': THEME.SECONDARY.textColor,
                    '--border': THEME.SECONDARY.borderColor,
                }}
            >
                <NavDrawer
                    open={menuOpen}
                    onClose={() => setMenuOpen(false)}
                    links={links}
                    di={di}
                />

                <Marquee text={localStorage.getItem('tip') ?? "Have a great day!"} className='text-start text-white/75' />
                <div className='grow flex gap-3'>
                    {
                        pages.map((page) => {
                            const isActive = activePage.label === page.label;
                            return (
                                <Button
                                    key={page.label}
                                    variant={isActive ? 'default' : 'secondary'}
                                    className='w-fit'
                                    style={
                                        isActive
                                            ? { '--primary': THEME.SUCCESS.bg, '--primary-foreground': THEME.SUCCESS.textColor, '--primary-hover': THEME.SUCCESS_DARK.bg }
                                            : { '--secondary': THEME.SECONDARY.bg, '--secondary-foreground': THEME.SECONDARY.textColor, '--secondary-hover': THEME.ACTIVE_BUTTON.bg }
                                    }
                                    onClick={() => setActivePage(page)}
                                >
                                    {page.label}
                                </Button>
                            );
                        })
                    }
                </div>
                <div className='flex flex-col items-end justify-center gap-0 bg-black/30 px-4 h-full shrink-0'>
                    <span className='text-xs whitespace-nowrap'>
                        {localStorage.getItem('business')}
                    </span>
                    <span className='text-xs whitespace-nowrap opacity-70'>
                        {di.getUser().organisation_name}
                    </span>
                </div>
            </Card>
        </div>
    )
}
