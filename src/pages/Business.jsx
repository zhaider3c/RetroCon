/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Card } from 'pixel-retroui';
import { THEME } from './Theme'
import BG from '@assets/business-bg.gif';


function proceed(business, di) {
    localStorage.setItem('business', business.id);
    localStorage.setItem('business_name', business.business_name);
    di.navigate('/dashboard');
}

const Business = ({ di }) => {
    const [business, setBusiness] = useState(null);
    const [user, setUser] = useState(false);
    useEffect(() => {
        if (!user) {
            di.request.get({
                url: di.api.get('user'), callback: r => {
                    setUser(r.data);
                    localStorage.setItem('user', JSON.stringify(r.data));
                }
            });
        }
        if (!business) {
            di.request.get({
                url: di.api.get('business-all'), callback: r => {
                    if (r.data.length == 1) {
                        proceed(r.data[0], di);
                    }
                    setBusiness(r.data);
                }
            });
        }
    }, []);


    return (
        <div className={`flex flex-col justify-center items-center w-full h-full bg-cover bg-bottom `} style={{ backgroundImage: `url(${BG})` }}>
            <div className='flex flex-col justify-center items-between gap-5'>
                <Card
                    {...THEME.SECONDARY}
                    className='text-2xl'
                >
                    <p>{`Welcome, ${user?.first_name ?? "User"} ${user?.last_name ?? "User"}`}</p>

                </Card>
                <Card
                    {...THEME.SECONDARY}
                    className='min-h-96 flex flex-col justify-start items-between gap-5'>
                    {
                        business && business.map((b, index) => {
                            return <Button {...THEME.ACTIVE} key={b.id} onClick={() => proceed(b, di)}>
                                {b.business_name}
                            </Button >
                        })
                    }
                </Card>
            </div>
        </div >
    );
};
export default Business;