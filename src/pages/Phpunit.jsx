/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Card, Input, TextArea } from 'pixel-retroui';
import { THEME } from './Theme';
import { TfiReload } from 'react-icons/tfi';
import { IoMdArrowRoundBack } from 'react-icons/io';
const Phpunit = ({ di }) => {
    const [url, setUrl] = useState(false);
    const [host, setHost] = useState("UNICON");
    function getJsonLink() {
        if (host) {
            return di.api.get("phpunit", "PHPUNIT");
        }
    }
    useEffect(() => {
        setUrl(getJsonLink());
    }, [host]); return (
        <div className='flex flex-col items-center gap-5 w-full h-full p-5 bg-[url("/swagger-bg.gif")] bg-no-repeat bg-center bg-cover'>
            <div className='flex flex-col justify-between items-between gap-5 overflow-hidden w-full h-full'>
                <Card {...THEME.SECONDARY} className='flex gap-5 items-center'>
                    <h1 className='px-5'>PhPUnit</h1>
                    <Input {...THEME.ACTIVE_INPUT} className="grow" value={url} onChange={(e) => {
                        setUrl(e.target.value);
                    }} />
                    <div className='px-5' onClick={() => {
                        setUrl(url.substring(0, url.lastIndexOf('/'))+'/');
                    }}><IoMdArrowRoundBack className='text-3xl duration-300' /></div>
                    <div className='px-5' onClick={() => {
                        document.body.querySelector('iframe').src = url;
                    }}><TfiReload className='text-3xl duration-300' /></div>
                </Card>
                <Card {...THEME.SECONDARY} className='grow flex flex-row-reverse gap-5 p-5 overflow-auto'>
                    <div className='flex gap-5 justify-center grow overflow-hidden rounded-2xl'>
                        <div className='overflow-auto grow bg-white/75 rounded-xl border-4 border-amber-800 w-full'>
                            <iframe className='w-full h-full' src={url} onLoad={(e) => {
                                setUrl(e.target.contentWindow.location.href);
                            }}></iframe>
                        </div>
                    </div>
                </Card >
            </div>
        </div >
    )
};
export default Phpunit;