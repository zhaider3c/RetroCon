import React, { useEffect, useRef, useState } from 'react';
import { Button, Card } from 'pixel-retroui';
import { useSearchParams } from 'react-router-dom';
import { THEME } from './Theme';

const Message = ({ di }) => {
    const BG = '/message.webp';
    const [searchParams, setSearchParams] = useSearchParams();
    const [forward, setFroward] = useState(searchParams.get('forward') ?? '/business');
    const [tt, setTt] = useState();
    const [wait, setWait] = useState(searchParams.get('wait') ?? 1500);
    const [countdown, setCountdown] = useState(Math.ceil((searchParams.get('wait') ?? 5000) / 1000));

    if (searchParams.has('token'))
        localStorage.setItem('token', searchParams.get('token'));
    if (searchParams.has('user'))
        localStorage.setItem('user', searchParams.get('user'));

    const navigate = (forward) => {
        let x = clearTimeout(tt);
        di.navigate(forward);
    }

    useEffect(() => {
        const waitTime = parseInt(searchParams.get('wait') ?? 3000);
        setWait(waitTime);
        setCountdown(Math.ceil(waitTime / 1000));

        if (searchParams.get('auto') == true || !searchParams.has('auto')) {
            let timeOut = setTimeout(() => {
                navigate(forward);
            }, waitTime)
            setTt(timeOut);
            return () => { clearTimeout(timeOut) };
        }
    }, [])

    // Countdown effect
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [countdown]);

    return (
        <div style={{
            backgroundImage: `url(${BG})`,
            backgroundColor: '#7EAB93'
        }} className='w-full h-full flex flex-col justify-center items-center bg-top bg-fill bg-no-repeat' >
            <div className='flex flex-col justify-center items-between gap-5'>
                <Card {...THEME.SECONDARY} className='min-h-32 min-w-64 flex items-center'>
                    <p className='text-center w-full'>
                        {searchParams.get('message')}
                        {/* Redirection counter */}
                        {wait && (
                            <span className="block text-xs text-gray-500 mt-2">
                                Redirecting in {countdown} seconds...
                            </span>
                        )}
                    </p>
                </Card>
                <Button {...THEME.ACTIVE}
                    className='outline-none'
                    onClick={
                        () => {
                            clearTimeout(tt);
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