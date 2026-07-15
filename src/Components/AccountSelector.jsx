import React, { useEffect, useState } from 'react';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'pixel-retroui';
import { THEME } from '@pages/Theme';
export default function Account({ account, setAccount = () => { }, di,theme = THEME.SECONDARY, className = ''}) {
    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        di.request.get({
            url: di.api.get('account-all'),
            callback: (data) => {
                setAccounts(data.data);
            }
        });
    }, []);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={className} {...theme}>{account?.name ?? "Select Account"}</DropdownMenuTrigger>
            <DropdownMenuContent {...theme}>
                {accounts.map((account) => (
                    <DropdownMenuItem key={account.id} className='hover:bg-white/15! rounded-xl'>
                        <Button {...THEME.SEAMLESS} onClick={() => setAccount(account)}>{account.name}</Button>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}