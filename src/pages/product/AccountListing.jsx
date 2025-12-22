
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Input, Popup } from 'pixel-retroui';
import { THEME } from '../Theme';
import Pagination from '@components/Paginator';
import { LuRefreshCw } from 'react-icons/lu';
import { FaEllipsis } from 'react-icons/fa6';
import ReactJson from '@microlink/react-json-view';
import Scroll from '@components/Scroll';

const PER_PAGE = 5;



const AccountSelector = ({ accounts, account, setAccount }) => {
    account.name = account.name.replaceAll('_', ' ');
    return (
        <DropdownMenu {...THEME.ACTIVE}>
            <DropdownMenuTrigger>
                {account ? account?.name : 'Select Account'}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {accounts.map((account, i) => (
                    <DropdownMenuItem key={i} className=''>
                        <Button {...THEME.SEAMLESS} data-index={i} onClick={(e) => setAccount(e.target.getAttribute('data-index'))}>
                            {account.name.replaceAll('_', ' ')}
                        </Button>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const Products = ({ products, keyMap, setPopup }) => {
    return (
        <div className='flex flex-col gap-3 w-full h-165!'>
            {products && products.map((p, i) => {
                return (
                    <div key={i} className='flex gap-0 bg-white/25 rounded-xl p-3 border-2! border-white gap-5 items-center'> {
                        Object.keys(keyMap).map((k, ki) => {
                            let field = p[keyMap[k].original_field];
                            if (typeof field == 'object') {
                                return null
                            }
                            return (<div key={ki} className='flex flex-col gap-0'>
                                <span className='font-bold'>{k}: </span>
                                <span className='ps-5'>{typeof field == 'object' ? 'SKIPPED -- TO BIG' : field}</span>
                            </div>
                            )
                        })
                    }
                        <p onClick={() => setPopup(p)} className='cursor-pointer text-white'><FaEllipsis /></p>
                    </div>
                )
            })}
        </div>
    )
}

const Filter = ({ setFilter, filter, setCursor, setNextCursor }) => {

    function setFilterValue(value) {
        setCursor(false);
        setNextCursor(false);
        setFilter(value);
        setPage(1);
    }

    return (
        <Card className='grid grid-cols-4 justify-start items-center' {...THEME.ACTIVE}>
            <p>
                Stock :
            </p>
            <button style={{ backgroundColor: filter == "\\b([1-9]\\d*)\\b" ? "#072" : "transparent" }} className='rounded-xl w-full px-3!' onClick={() => setFilterValue("\\b([1-9]\\d*)\\b")}>
                <span className="text-white">
                    In
                </span>
            </button>
            <button style={{ backgroundColor: filter == "\\b0\\b" ? "#072" : "transparent" }} className='rounded-xl w-full px-3' onClick={() => setFilterValue("\\b0\\b")}>
                <span className="text-white">
                    Out
                </span>
            </button>
            <button style={{ backgroundColor: filter == false ? "#072" : "transparent" }} className='rounded-xl w-full px-3' onClick={() => setFilterValue(false)}>
                <span className="text-white">
                    All
                </span>
            </button>
        </Card>
    )
}
const Main = ({ di }) => {

    function fetchAccounts(di) {
        return di.request.get({
            url: di.api.get('account-all'),
            callback: (data) => {
                setAccounts(data.data);
            }
        });
    }

    function fetchProducts(account, di, setCursor, nextCursor, filter) {
        return di.request.get({
            url: di.api.get('unlinked-products') + "?account_id=" + account.id
                + "&per_page=" + PER_PAGE +
                (nextCursor ? "&cursor=" + nextCursor : "") +
                ("&all_products=true") +
                (filter ? "&filter[quantity][1]=" + filter : ""),
            callback: (data) => {
                setProducts(data.data);
                setKeyMap(data.key_map);
                setCursor(data.cursor);
            }
        });
    }

    const [account, setAccount] = useState(0);
    const [accounts, setAccounts] = useState([]);
    const [products, setProducts] = useState([]);
    const [keyMap, setKeyMap] = useState({});
    const [cursor, setCursor] = useState(false);
    const [nextCursor, setNextCursor] = useState(false);
    const [filter, setFilter] = useState(false);
    const [page, setPage] = useState(1);
    const [popup, setPopup] = useState(false);
    useEffect(() => {
        fetchAccounts(di);
    }, []);

    useEffect(() => {
        if (accounts[account]) {
            fetchProducts(accounts[account], di, setCursor, nextCursor, filter);
        }
    }, [account, accounts, nextCursor, filter]);

    if (!accounts || !accounts[account]) {
        return <div>Loading...</div>;
    }

    return (
        <div className='flex flex-col gap-5 p-5'>
            <Popup {...THEME.SECONDARY} isOpen={popup} onClose={() => setPopup(false)}>
                <div className='w-256 h-128'>
                    <Scroll>
                        <ReactJson src={popup} theme={THEME.JSON.DEFAULT} />
                    </Scroll>
                </div>
            </Popup>
            <div className='flex justify-start items-center gap-5'>
                <AccountSelector accounts={accounts} account={accounts[account]} setAccount={setAccount} />
                <Filter setFilter={setFilter} filter={filter} setCursor={setCursor} setNextCursor={setNextCursor} />
                <Button {...THEME.ACTIVE} onClick={(e) => { setNextCursor(false); }}><LuRefreshCw className='text-2xl duration-500'
                    onTransitionEnd={(e) => { e.target.style.transform = "rotate(0deg)"; }}
                    onClick={
                        (e) => { e.target.style.transform = "rotate(360deg)"; }
                    } /></Button>
            </div>
            <Products products={products} keyMap={keyMap} setPopup={setPopup} />
            <Pagination page={page} setPage={setPage} cursor={cursor} setNextCursor={setNextCursor} />
        </div>
    )
}
export default Main;