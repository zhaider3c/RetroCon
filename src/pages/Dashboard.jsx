/* eslint-disable react/prop-types */
import React, { Component, useEffect, useState } from 'react';
import { Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, ProgressBar } from 'pixel-retroui';
import { THEME } from './Theme';
import Scroll from '@components/Scroll.jsx';
import Json from '@components/Json.jsx';
import uniNew from '@assets/uni-new.png';

const COLORS = [
    "#ff2f2f",
    "#2fff2f",
    "#2f2fff",
    "#2fffff",
];

function ProductStatus({ product }) {
    return (<Card {...THEME.ACTIVE} className='w-full col-span-5'>
        <p className='text-xl'>Products: {product['total']}</p>
        {
            product && Object.keys(product).map((x, i) => {
                if (x != 'total') {
                    return (
                        <div key={i} className='px-5'>
                            <label>{x.toLocaleUpperCase()} : {product[x]}</label>
                            <ProgressBar size='lg' color={COLORS[i % COLORS.length]} progress={(product[x] * 100) / product['total']} />
                        </div>
                    );
                }
            })
        }
    </Card>);
}

function Account({ account }) {
    return (<Card {...THEME.ACTIVE} className='w-full col-span-3 flex flex-col h-full overflow-auto p-3'>
        {
            account && Object.keys(account).map((x, i) => {
                return (
                    <div key={i} className='flex gap-5 justify-between'>
                        <p >{x}</p>
                        <p >{account[x]}</p>
                    </div>
                )
            })
        }
    </Card>);
}

function Variants({ productWithImage }) {
    return (<Card {...THEME.ACTIVE} className='w-full col-span-2 flex flex-col'>
        <p className='text-xl'>Variant type</p>
        <p className='text-center text-6xl'> {productWithImage.count}</p>
    </Card>);
}

function Channels({ channels }) {
    return (<div className='w-full col-span-2 flex flex-col'>
        {channels.map((channel, i) => {
            let state = btoa(JSON.stringify({ matketplace: channel.code, code: channel.code, businessId: localStorage.getItem('business') }));
            return (
                <Card key={i} className='flex justify-between items-center'{...THEME.ACTIVE}>
                    <p>{channel.name}</p>
                    <Button {...THEME.SECONDARY}
                        className='text-sm'>
                        <a href={`${channel?.auth_url ?? '#'}?channel_id=${channel.id}&state=${state}&sandbox=1`} target='_blank'>Connect</a>
                    </Button>
                </Card>
            )
        })}
    </div>);
}
function Events({ di, channels, }) {
    const [accounts, setAccounts] = useState([]);
    const [account, setAccount] = useState(null);

    const [data, setData] = useState({});

    async function getGroup(channel_id) {
        let foundGroup = null;
        await di.request.get({
            url: di.api.get('channel-group'),
            callback: (data) => {
                for (let group of data.data) {
                    for (let channel of group.channel_id) {
                        if (channel == channel_id) {
                            foundGroup = group;
                            return;
                        }
                    }
                }
            }
        });
        return foundGroup;
    }

    useEffect(() => {
        di.request.get({
            url: di.api.get('account-all'),
            callback: (data) => {
                setAccounts(data.data);
            }
        });
    }, []);

    const events = [
        {
            event: 'User::onConfirm',
            component: (
                <div className='flex flex-col gap-2'>
                    <Button className='' onClick={(e) => {
                        di.request.post({
                            url: di.api.get('fire-event'),
                            body: JSON.stringify({
                                event: 'User::onConfirm',
                                business_id: localStorage.getItem('business')
                            })
                        });
                    }}>
                        User::onConfirm
                    </Button>
                </div>
            )
        },
        {
            event: 'Account::onConnect',
            component: (
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger>{account?.name ?? "Select Account"}</DropdownMenuTrigger>
                        <DropdownMenuContent {...THEME.ACTIVE}>
                            {accounts && accounts.map((account, i) => {
                                return <DropdownMenuItem key={i}>
                                    <Button
                                        {...THEME.ACTIVE}
                                        onClick={async (e) => {
                                            setAccount(account);
                                            let group = await getGroup(account.channel_id);
                                            setData({
                                                event: 'Account::onConnect',
                                                account_id: account.id,
                                                channel_id: account.channel_id,
                                                business_id: localStorage.getItem('business'),
                                                user_id: di.decodedToken().user_id,
                                                group_id: group.id,
                                                channel_name: account.name.split('_')[0].toLowerCase(),
                                            });
                                        }}
                                    >
                                        {account.name}
                                    </Button>
                                </DropdownMenuItem>
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button className='' onClick={(e) => {
                        di.request.post({
                            url: di.api.get('fire-event'),
                            body: JSON.stringify(
                                data
                            )
                        });
                    }}>
                        Fire Event
                    </Button>
                </div>
            )
        }
    ]

    return (
        <Card {...THEME.ACTIVE} className='w-full col-span-2 flex flex-col justify-center items-start'>
            <p className='text-xl '>Events</p>
            <div className='flex flex-col gap-3 justify-between items-start'>
                {
                    events.map((event, i) => {
                        return (
                            <div key={i}>
                                <p>{event.event}</p>
                                {event.component}
                            </div>
                        )
                    })
                }
            </div>
        </Card>
    );
}
const Dashboard = ({ di }) => {

    const [user, setUser] = useState({});
    const [product, setProduct] = useState({});
    const [productWithImage, setProductWithImage] = useState({}); // These are variants. Param name is wrong
    const [account, setAccount] = useState([]);
    const [channels, setChannels] = useState([]);
    useEffect(() => {
        di.request.get({
            url: di.api.get('channel'), callback: (data) => {
                setChannels(data.data);
            }
        });
        di.request.get({
            url: di.api.get('user'), callback: (data) => {
                setUser(data.data);
            }
        });
        di.request.get({
            url: di.api.get('product-count'), callback: (data) => {
                setProduct(data.data);
            }
        });
        di.request.get({
            url: di.api.get('product-count') + "?filter[u_product_type][1]=variant", callback: (data) => {
                setProductWithImage(data.data);
            }
        });
        di.request.get({
            url: di.api.get('account-setting'), callback: (data) => {
                setAccount(data.data);
            }
        });
    }, []);

    const elements = [
        [
            ProductStatus({ product }),
            Variants({ productWithImage }),
            // Account({ account })
        ],
        [
            <Card {...THEME.ACTIVE} className='w-full text-2xl'>Channels</Card>,
            Channels({ channels })
        ],
        [
            Account({ account }),
            Events({ di: di, accounts: account, channels: channels })
        ],
    ];

    return (
        <div className='flex flex-col gap-5 w-full h-full p-5 bg-cover bg-bottom' style={{ backgroundImage: `url("${uniNew}")` }}>
            <Card {...THEME.SECONDARY}>
                <h1>Dashboard - {user?.business_name ?? user?.organisation_name}</h1>
            </Card>
            <div className='overflow-hidden w-full flex justify-between items-start p-5 gap-5 h-128 '>
                {
                    elements.map((x, i) => {
                        return (<Scroll {...THEME.SECONDARY} key={i} className='grow'>
                            <div className='flex flex-col justify-between items-center p-5 gap-5 w-full'>
                                {
                                    x.map((y, j) => {
                                        return y;
                                    })
                                }
                            </div>
                        </Scroll>)
                    })
                }

            </div>
        </div>
    )
};
export default Dashboard;