/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Card, Popup } from 'pixel-retroui';
import { THEME } from './Theme';
import BG from '@assets/warehouse.gif';
import Pagination from '@components/Paginator';
import { FaSync } from 'react-icons/fa';

const Warehouse = ({ di }) => {
    const [accounts, setAccounts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [channels, setChannels] = useState([]);
    const [sort, setSort] = useState(['updated_at', -1]);
    const [cursor, setCursor] = useState(null);
    const [nextCursor, setNextCursor] = useState(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [popupOpen, setPopupOpen] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState(null);

    const PER_PAGE = 10;
    useEffect(() => {
        di.request.get({
            url: di.api.get('channel'),
            callback: (data) => {
                setChannels(data.data);
            }
        });
    }, []);
    useEffect(() => {
        let params = [
            `per_page=${PER_PAGE}`,
        ];
        if (sort) {
            params.push(`sort[${sort[0]}]=${sort[1]}`);
        }
        if (nextCursor) {
            params.push(`cursor=${nextCursor}`);
        }
        di.request.get({
            url: di.api.get('warehouse') + (params.length > 0 ? `?${params.join('&')}` : ""),
            callback: (data) => {
                setWarehouses(data.data);
                setCursor(data.cursor);
                setTotal(data?.total ?? 0);
            }
        });
    }, [sort, nextCursor, syncing]);

    useEffect(() => {
        di.request.get({
            url: di.api.get('account-all'),
            callback: (data) => {
                setAccounts(data.data);
            }
        });
    }, []);

    let channelIdMap = null;
    function getChannelName(id) {
        if (!channelIdMap) {
            channelIdMap = channels.reduce((acc, channel) => {
                acc[channel.id] = channel.name;
                return acc;
            }, {});
        }
        return channelIdMap[id] ?? 'Unicon';
    }

    let accountIdMap = null;
    function getAccountName(id) {
        if (!accountIdMap) {
            accountIdMap = accounts.reduce((acc, account) => {
                acc[account.id] = account.name;
                return acc;
            }, {});
        }
        return accountIdMap[id] ?? "Unicon";
    }
    function handleSort(sortKey) {
        if (sort && sortKey === sort[0]) {
            setSort([sortKey, sort[1] === 1 ? -1 : 1]);
        } else {
            setSort([sortKey, 1]);
        }
    }

    function syncWarehouses(accountId) {
        if (!syncing) {
            di.request.post({
                url: di.api.get('warehouse-import'),
                body: JSON.stringify({
                    account_id: accountId
                }),
                callback: (data) => {
                    if (data?.data?.not_deleted) {
                        setError(data?.data?.not_deleted);
                    } else {
                        setError(null);
                    }
                    setSyncing(null);
                }
            });
        }
    }

    const getStatus = (text) => {
        let colors = {
            text: 'text-green-500',
            bg: 'bg-green-300',
            border: 'border-green-700!',
        };
        switch (text.toLowerCase()) {
            case 'active':
                colors = {
                    text: 'text-green-300',
                    bg: 'bg-green-800',
                    border: 'border-green-700!',
                };
                break;
            case 'inactive':
                colors = {
                    text: 'text-yellow-300',
                    bg: 'bg-yellow-800',
                    border: 'border-yellow-700!',
                };
                break;
            case 'deleted':
                colors = {
                    text: 'text-red-300',
                    bg: 'bg-red-800',
                    border: 'border-red-700!',
                };
                break;
            default:
                colors = {
                    text: 'text-gray-300',
                    bg: 'bg-gray-800',
                    border: 'border-gray-700!',
                };
                break;
        }
        return <div className={`rounded-sm text-sm font-black px-3 py-0 border-2! ${colors.border} ${colors.bg} capitalize`}><span className={`${colors.text}`}>{text}</span></div>;
    }

    const ArrowUp = <span className='text-white/35'>▲</span>;
    const ArrowDown = <span className='text-white/35'>▼</span>;

    return (
        <div className='w-full h-full flex flex-col justify-center items-center bg-cover bg-center p-5 gap-5' style={{ backgroundImage: `url(${BG})` }}>
            <Popup {...THEME.SECONDARY} isOpen={popupOpen} onClose={() => {
                setPopupOpen(false);
                setSyncing(null);
                setError(null);
            }}>
                <div className='flex flex-col gap-2'>
                    <p> Accounts </p>
                    {error && <div className='text-red-700 bg-red-300 rounded-xl px-5 py-3 border-2! border-red-700!'>
                        <p>Deleted warehouses in use</p>
                        {typeof error === 'object' && error.map((err) => (
                            <p key={err.id}>{err.name} - In use in {err.reason}</p>
                        ))}
                    </div>}
                    {
                        accounts.map((account) => (
                            <div key={account.id} className='flex justify-between items-center gap-2 bg-black/50 rounded-xl px-5'>
                                <p>{account.name.replaceAll('_', ' ')}</p>
                                <Button data-account-id={account.id} className={(syncing && syncing != account.id) ? 'disabled text-red-500!' : ''} {...THEME.SEAMLESS} onClick={(e) => {
                                    let accId = e.target.getAttribute('data-account-id');
                                    setSyncing(accId);
                                    syncWarehouses(accId);
                                }}>{
                                        (syncing && syncing == account.id) ? 'Syncing...' : (!syncing ? 'Sync' : 'Blocked')
                                    }</Button>
                            </div>
                        ))
                    }
                </div>
            </Popup>
            <div className='w-fit flex flex-col gap-2 items-center justify-center'>
                <div className='flex w-full justify-between items-center gap-2'>
                    <h1 className='text-2xl text-white font-bold pe-5'>Warehouses</h1>
                    <Button className='flex gap-5 items-center justify-center' {...THEME.ACTIVE} onClick={() => { setPopupOpen(true) }} >Sync <FaSync className='spinny text-xl' /></Button>
                    {cursor && <p className='text-white'>{(PER_PAGE * (page - 1)) + 1} to {(PER_PAGE * page) > total ? total : (PER_PAGE * page)} of {total}</p>}
                    {cursor && <Pagination cursor={cursor} setNextCursor={setNextCursor} setPage={setPage} />}
                </div>
                <Card {...THEME.ACTIVE} className='w-fit flex flex-col gap-2'>
                    <table className='text-white table-auto w-fit'>
                        <thead>
                            <tr className='text-start font-bold text-lg'>
                                <td className='pe-5 cursor-pointer' onClick={(e) => handleSort("name")}>Name {sort && sort[0] === "name" ? sort[1] === 1 ? ArrowUp : ArrowDown : ""} </td>
                                {/* <td className='px-5 cursor-pointer' onClick={(e) => handleSort("channel_id")}>Channel {sort && sort[0] === "channel_id" ? sort[1] === 1 ? ArrowUp : ArrowDown : ""} </td> */}
                                <td className='px-5 cursor-pointer' onClick={(e) => handleSort("status")}>Status {sort && sort[0] === "status" ? sort[1] === 1 ? ArrowUp : ArrowDown : ""} </td>
                                <td className='px-5 cursor-pointer' onClick={(e) => handleSort("updated_at")}>Updated {sort && sort[0] === "updated_at" ? sort[1] === 1 ? ArrowUp : ArrowDown : ""} </td>
                                <td className='px-5 cursor-pointer' onClick={(e) => handleSort("created_at")}>Created {sort && sort[0] === "created_at" ? sort[1] === 1 ? ArrowUp : ArrowDown : ""} </td>
                            </tr>
                        </thead>
                        {warehouses.map((warehouse) => (
                            <tr key={warehouse.id} className='text-start text-slate-300 border-b-2! border-white/10!'>
                                <td className='pe-5 py-1 flex flex-col gap-1'>
                                    <span>
                                        {warehouse.name}
                                    </span>
                                    <span className='text-xs text-white/50'>
                                        {getAccountName(warehouse.account_id)}
                                    </span>
                                </td>
                                {/* <td className='px-5'>{getChannelName(warehouse.channel_id)}</td> */}
                                <td className='px-5'>{getStatus(warehouse.status)}</td>
                                <td className='px-5'>{di.formatTime(warehouse.updated_at / 1000)}</td>
                                <td className='px-5'>{di.formatTime(warehouse.created_at / 1000)}</td>
                            </tr>
                        ))}
                    </table>
                </Card>
            </div>
        </div>
    )
}

export default Warehouse;