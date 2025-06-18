/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Card } from 'pixel-retroui';
import { THEME } from './Theme'
import BG from '@assets/business-bg.gif';


const Business = ({ di }) => {
    const navigate = di.navigate;
    const [business, setBusiness] = useState([]);
    const [user, setUser] = useState(null);
    useEffect(() => {
        if (business.length <= 0) {
            di.request.get({
                url: di.api.get('business-all'), callback: r => {
                    setBusiness(r.data);
                }
            });
        }
        if (!user) {
            di.getUser().then(r => {
                setUser(r);
            });
        }
    }, []);


    return (
        <div className={`flex flex-col justify-center items-center w-full h-full bg-cover bg-bottom bg-[url("${BG}")]`}>
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
                            return <Button {...THEME.ACTIVE} key={b.id} onClick={() => {
                                localStorage.setItem('business', b.id);
                                localStorage.setItem('business_name', b.business_name);
                                di.navigate('/dashboard');

                            }}>
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