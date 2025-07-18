/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Card, ProgressBar } from 'pixel-retroui';
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

const Dashboard = ({ di }) => {

    const [user, setUser] = useState({});
    const [product, setProduct] = useState({});
    const [productWithImage, setProductWithImage] = useState({}); // These are variants. Param name is wrong
    const [account, setAccount] = useState([]);
    useEffect(() => {
        di.request.get({
            url: di.api.get('user'), callback: (data) => {
                setUser(data.data);
            }
        });
    }, []);
    useEffect(() => {
        di.request.get({
            url: di.api.get('product-count'), callback: (data) => {
                setProduct(data.data);
            }
        });
    }, []);
    useEffect(() => {
        di.request.get({
            url: di.api.get('product-count') + "?filter[u_product_type][1]=variant", callback: (data) => {
                setProductWithImage(data.data);
            }
        });
    }, []);
    useEffect(() => {
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
            Account({ account })
        ],
        [
            <div className='col-span-4 overflow-hidden'>
                <Json data={user} className='w-full h-full overflow-auto' />
            </div>
        ],
        [
        ],
    ];

    return (
        <div className='flex flex-col gap-5 w-full h-full p-5 bg-cover bg-bottom' style={{ backgroundImage: `url("${uniNew}")` }}>
            <Card {...THEME.SECONDARY}>
                <h1>Dashboard - {user?.business_name ?? user?.organisation_name}</h1>
            </Card>
            <div className='overflow-hidden w-full flex justify-between items-start p-5 gap-5'>
                {
                    elements.map((x, i) => {
                        return (<Scroll {...THEME.SECONDARY} key={i} className='grow'>
                            <div className='h-full flex flex-col justify-between items-start p-5 gap-5 w-full'>
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