import React, { useState } from 'react';
import Accounts from '@pages/user/Accounts';
import BG from '@assets/user_bg.gif';
import Config from '@pages/user/Config';
import PageSidebar from '@components/PageSidebar';

const Nav = ({ pages, setPage, page, di }) => {
    const [user] = useState(di.getUser());
    const sections = [{
        items: pages.map((p) => ({
            key: p.text,
            label: p.text,
            active: page.text === p.text,
            onClick: () => setPage(p),
        })),
    }];
    return (
        <PageSidebar
            theme="glass"
            header={<p className='text-2xl border-b-2! border-white/50! text-center p-3'>{user?.name}</p>}
            sections={sections}
        />
    );
};
const Main = ({ di }) => {
    const pages = [
        {
            'text': "Accounts",
            'hint': "Marketplace Accounts",
            'component': <Accounts di={di} />
        },
        {
            'text': "Config",
            'hint': "Configuration",
            'component': <Config di={di} />
        }
    ]
    const [page, setPage] = useState(pages[0]);
    return (<div className='w-full h-full flex text-white bg-cover bg-bottom overflow-hidden' style={{ backgroundImage: `url(${BG})` }}>
        <Nav pages={pages} setPage={setPage} page={page} di={di} />
        <div className='grow h-full'>
            {page.component}
        </div>
    </div>);
};

export default Main;