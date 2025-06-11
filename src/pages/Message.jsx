import React, { useEffect, useRef, useState } from 'react';
import { Button, Card } from 'pixel-retroui';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { THEME } from './Theme';
const Message = ({ di }) => {
    const BG = '/message.webp';
    const [searchParams, setSearchParams] = useSearchParams();
    const [forward, setFroward] = useState('/business');
    const [tt, setTt] = useState();
    if (searchParams.has('token'))
        localStorage.setItem('token', searchParams.get('token'));
    if (searchParams.has('user'))
        localStorage.setItem('user', searchParams.get('user'));
    const navigate = useNavigate();
    useEffect(() => {
        setFroward(searchParams.get('forward') ?? '/business');
        console.log(forward);
        clearTimeout(tt);
        if (searchParams.get('auto') == true || !searchParams.has('auto')) {
            setTt(setTimeout(() => {
                navigate(forward);
            }, searchParams.get('wait') ?? 1500));
        }
    }, [])
    return (
        <div style={{
            backgroundImage: `url(${BG})`,
            backgroundColor: '#7EAB93'
        }} className='w-full h-full flex flex-col justify-center items-center bg-top bg-fill bg-no-repeat' >
            <div className='flex flex-col justify-center items-between gap-5'>
                <Card {...THEME.SECONDARY} className='min-h-32 min-w-64 flex items-center'>
                    <p className='text-center w-full'>
                        {searchParams.get('message')}
                    </p>
                </Card>
                <Button {...THEME.ACTIVE}
                    className='outline-none'
                    onClick={
                        () => {
                            navigate(forward);
                        }
                    }
                >
                    Continue
                </Button>
            </div>
        </div >
    );
};
export default Message;