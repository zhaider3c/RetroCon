import { Button } from 'pixel-retroui';
import React, { useEffect, useState } from 'react';
import { THEME } from '@pages/Theme';
import Accounts from '@pages/user/Accounts';

const Nav = ({ pages, setPage, page, di }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        di.getUser().then(r => {
            setUser(r);
        });
    }, []);
    return (<div className='flex flex-col gap-2 h-full bg-black/25 p-0'>
        <p className='text-2xl border-b-2! border-white/50! text-center p-3'>{user?.name}</p>
        <div className='flex flex-col gap-2 py-3'>
            {
                page && pages.map((page) => {
                    return <Button {...(page === page ? THEME.SUCCESS : THEME.SECONDARY)} onClick={() => setPage(page)}>
                        {page.text}
                    </Button>;
                })}
        </div>
    </div>);
};
const Main = ({ di }) => {
    const pages = [
        {
            'text': "Accounts",
            'hint': "Marketplace Accounts",
            'component': <Accounts di={di} />
        }
    ]
    const [page, setPage] = useState(pages[0]);
    return (<div className='w-full h-full flex bg-orange-800 text-white'>
        <Nav pages={pages} setPage={setPage} page={page} di={di} />
        <div className='grow'>
            {page.component}
        </div>
    </div>);
};

export default Main;