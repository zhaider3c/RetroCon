/* eslint-disable react/prop-types */
import React from 'react';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'pixel-retroui';
import { THEME } from '@pages/Theme';

const ProductAccountSelector = ({ accounts, account, setAccount }) => (
    <DropdownMenu {...THEME.ACTIVE}>
        <DropdownMenuTrigger>
            {account ? account?.name?.replaceAll('_', ' ') : 'Select Account'}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            {accounts.map((a, i) => (
                <DropdownMenuItem key={i}>
                    <Button {...THEME.SEAMLESS} data-index={i} onClick={(e) => setAccount(e.target.getAttribute('data-index'))}>
                        {a.name.replaceAll('_', ' ')}
                    </Button>
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
);

export default ProductAccountSelector;
