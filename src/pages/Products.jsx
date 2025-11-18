/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Input, Popup } from 'pixel-retroui';
import { THEME } from './Theme';
import Listing from '@pages/product/Listing';
import Inventory from '@pages/product/Inventory';
import AccountListing from '@pages/product/AccountListing';


const Products = ({ di }) => {
    const pages = [
        {
            'label': 'Listing',
            description: 'View and manage products',
            component: <Listing di={di} />
        },
        {
            label: 'Inventory',
            description: 'View and manage inventory',
            component: <Inventory di={di} />
        },
        {
            label: 'Marketplace',
            description: 'View and manage products imported from marketplace',
            component: <AccountListing di={di} />
        }
    ]

    const [activePage, setPage] = useState(pages[0]);
    return (
        <div className="h-full w-full flex bg-cover bg-center overflow-hidden bg-cyan-800">
            <Card {...THEME.ACTIVE} className="p-3 flex flex-col justify-start items-center gap-2 h-full">
                {pages.map((page) => {
                    return <Button key={page.label} onClick={() => setPage(page)} className="w-full" {...(activePage === page.label ? THEME.SUCCESS : THEME.SECONDARY)}>
                        {page.label}
                    </Button>
                })}
            </Card>
            <div className="grow h-full">
                {activePage.component}
            </div>
        </div>
    )
}

export default Products;