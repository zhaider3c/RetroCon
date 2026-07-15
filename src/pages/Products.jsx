/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Listing from '@pages/product/Listing';
import Inventory from '@pages/product/Inventory';
import AccountListing from '@pages/product/AccountListing';
import LinkedListing from '@pages/product/LinkedListing';
import productBg from '@assets/product-bg.gif';
import PageSidebar from '@components/PageSidebar';


const Products = ({ di }) => {
    const sections = [
        {
            items: [
                { label: 'Listing', component: <Listing di={di} /> },
                { label: 'Inventory', component: <Inventory di={di} /> },
            ],
        },
        {
            title: 'Marketplace Listing',
            items: [
                { label: 'Linked', component: <LinkedListing di={di} /> },
                { label: 'Unlinked', component: <AccountListing di={di} /> },
                { label: 'All Products', component: <AccountListing di={di} allProducts /> },
            ],
        },
    ];

    const allItems = sections.flatMap((s) => s.items);
    const [active, setActive] = useState(allItems[0].label);
    const activePage = allItems.find((p) => p.label === active);

    const sidebarSections = sections.map((s) => ({
        title: s.title,
        items: s.items.map((item) => ({
            label: item.label,
            active: active === item.label,
            onClick: () => setActive(item.label),
        })),
    }));

    return (
        <div style={{ backgroundImage: `url('${productBg}')` }} className="h-full w-full flex bg-cover bg-center overflow-hidden">
            <PageSidebar theme="default" sections={sidebarSections} />
            <div className="grow h-full min-w-0 overflow-hidden">
                {activePage?.component}
            </div>
        </div>
    );
};

export default Products;
