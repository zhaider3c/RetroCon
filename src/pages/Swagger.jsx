/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Card, TextArea } from 'pixel-retroui';
import { THEME } from './Theme';
import swaggerBg from '@assets/swagger-bg.gif';

const HOSTS = ["UNICON", "CATALOG", "SALES"];
const Swagger = ({ di }) => {
    const [json, setJson] = useState();
    const [url, setUrl] = useState(false);
    const [host, setHost] = useState("UNICON");
    const [showJson, setShowJson] = useState(false);
    function getJsonLink() {
        if (host) {
            di.request.get({ url: di.api.get("swagger", host), callback: (data) => { setUrl(data.swagger_file_url) }, error_handle: false });
        }
    }
    useEffect(() => {
        getJsonLink();
    }, [host]);
    useEffect(() => {
        if (url) {
            fetch(url, {
            })
                .then((res) => res.json())
                .then((data) => {
                    setJson(data);
                }).catch((err) => {
                });
        }
    }, [url]);
    return (
        <div className='flex flex-col items-center gap-5 w-full h-full p-5' style={{ backgroundImage: `url(${swaggerBg})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover' }}>
            <div className='flex flex-col items-start gap-5 overflow-hidden min-w-[70%] h-full'>
                <Card {...THEME.SECONDARY}>
                    <h1 className='px-5'>API Reference</h1>
                </Card>
                <Card {...THEME.SECONDARY} className='grow flex flex-row-reverse gap-5 p-5 overflow-auto w-full'>
                    <div className='flex flex-col gap-5 justify-start'>
                        {
                            HOSTS.map((e, i) => {
                                return <Button {...THEME.ACTIVE} key={i} onClick={() => { setHost(e); getJsonLink(); }}>{e.split('.')[0].toUpperCase()}</Button>
                            })
                        }
                        <Button onClick={() => setShowJson(!showJson)}>{!showJson ? `Show` : 'Hide'} JSON</Button>
                    </div>
                    <div className='flex gap-5 justify-center grow overflow-hidden rounded-2xl'>
                        <TextArea className={'bg-white/35 w-1/2 overflow rounded-2xl border-none' + ` ${showJson ? '' : 'hidden'}`} value={JSON.stringify(json, null, 2)}></TextArea>
                        <div className='overflow-auto grow bg-white/75 rounded-xl border-4 border-amber-800 w-full'>
                            <iframe className='w-full h-full' src={url}></iframe>
                        </div>
                    </div>
                </Card >
            </div>
        </div >
    )
};
export default Swagger;