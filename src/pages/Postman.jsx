/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Input, Popup, TextArea } from 'pixel-retroui';
import { THEME } from './Theme';
import Scroll from '@components/Scroll';
import ReactJsonView from '@microlink/react-json-view';

const VERBS =
    [
        "GET",
        "POST",
        "PUT",
        "PATCH",
    ];


const PRESETS = {
    "Cache Flush": "/rest/v2/cache/flush-all",
    "Get Config": "/rest/v2/system/config",
}



const Main = ({ di }) => {
    document.body.onkeydown = (e) => {
        if (e.key === "b" && e.ctrlKey) {
            setPredifOpen(!predifOpen ?? true);
        }
    }
    const HOSTS = {
        ...di.hosts,
        "Production": "https://unicon-backend.cedcommerce.com",
        "Dev": "https://uni-backend.cifapps.com",

    }
    const [url, setUrl] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('postman_token') || localStorage.getItem('token') || '');
    const [response, setResponse] = useState(null);
    const [host, setHost] = useState("None");
    const [verb, setVerb] = useState("GET");
    const [body, setBody] = useState(localStorage.getItem('post-body') || '');
    const [loading, setLoading] = useState(false);
    const [tokenOpen, setTokenOpen] = useState(false);
    const [predifOpen, setPredifOpen] = useState(false);


    // Debounce function helper
    const DEBOUNCE_TIME = 500;
    const debounce = (func, wait = DEBOUNCE_TIME) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    // Debounced handlers
    const handleUrlChange = (e) => setUrl(e.target.value);
    const handleTokenChange = (e) => {
        const value = e.target.value;
        setToken(value);
        localStorage.setItem('postman_token', value);
    };
    const handleBodyChange = (e) => {
        setBody(e.target.value);
        localStorage.setItem('post-body', e.target.value);
    };
    return (
        <div className='w-full h-full bg-[url("/postman.png")] bg-no-repeat bg-cover flex flex-col justify-center items-center gap-5'>
            <Popup {...THEME.ACTIVE} isOpen={predifOpen} onClose={() => setPredifOpen(false)} className='flex flex-col gap-3'>
                <h1 className='text-2xl text-center'>Common URLS</h1>
                <Card {...THEME.SECONDARY} className='grid grid-cols-1 justify-center items-center gap-3'>
                    {
                        Object.keys(PRESETS).map((x, u) => {
                            return (
                                <Button key={u} {...THEME.ACTIVE} data-url={PRESETS[x]} onClick={(e) => {
                                    setUrl(e.target.getAttribute('data-url'));
                                    setPredifOpen(false);
                                }}>{x}</Button>
                            )
                        })
                    }
                </Card>
            </Popup>
            <Popup {...THEME.ACTIVE} isOpen={tokenOpen} onClose={() => setTokenOpen(false)}>
                <div className='flex gap-5 justify-center items-center'>
                    <TextArea {...THEME.SECONDARY} placeholder='Token' rows={25} cols={50} value={token} onChange={handleTokenChange} />
                    <ReactJsonView src={{ object: JSON.parse(atob(token.split('.')[1])) }} theme='tomorrow' />
                </div>
            </Popup>
            <div className='flex w-full h-full flex-col gap-3 p-3'>
                <div className='flex flex-col items-between gap-3'>
                    <div className='flex gap-3 items-center justify-between'>
                        <Button onClick={() => setTokenOpen(true)} {...THEME.ACTIVE} className='h-full'>Token</Button>
                        <DropdownMenu {...THEME.ACTIVE} className='px-1 h-full'>
                            <DropdownMenuTrigger className='h-full'>
                                {verb ?? "---"}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent {...THEME.SECONDARY} className=''>
                                {
                                    VERBS.map((x, u) => {
                                        return (
                                            <DropdownMenuItem key={u} className='w-32 flex'>
                                                <Button data-host={x} className='grow' onClick={(e) => {
                                                    setVerb(x)
                                                }}>
                                                    {x}
                                                </Button>
                                            </DropdownMenuItem>
                                        )
                                    })
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu {...THEME.ACTIVE} className='px-1 h-full'>
                            <DropdownMenuTrigger className='h-full' >
                                {host ?? "Select Host"}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent {...THEME.SECONDARY} className='w-96 grid grid-cols-1 justify-center items-center gap-3'>
                                {
                                    Object.keys(HOSTS
                                    ).map((x, u) => {
                                        return (
                                            <DropdownMenuItem key={u} className='overflow-hidden grid grid-cols-1 justify-center items-center'>
                                                <div data-host={HOSTS[x]} className={`w-auto hover:bg-[${THEME.POP.bg}]`} onClick={(e) => {
                                                    setHost(e.target.getAttribute('data-host'))
                                                }}>
                                                    {HOSTS[x].replace("https://", "")}
                                                </div>
                                            </DropdownMenuItem>
                                        )
                                    })
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Input {...THEME.ACTIVE_INPUT} placeholder='/rest/v2/ping' onChange={handleUrlChange} value={url} className='grow h-full flex items-center justify-center' />
                        <Button {...(loading ? THEME.BLOCKED : THEME.ACTIVE)} className='h-full' onClick={async () => {
                            setLoading(true);
                            try {
                                setResponse({});
                                const response = await fetch(host === "None" ? url : host + url, {
                                    method: verb,
                                    headers: {
                                        'Authorization': 'Bearer ' + token,
                                        'Content-Type': 'application/json'
                                    },
                                    ...(verb === 'POST' ? { body: body } : {})
                                });
                                const json = await response.json();
                                setResponse(json);
                            } catch (error) {
                                console.error(error);
                                setResponse({ error: error });
                            } finally {
                                setLoading(false);
                            }
                        }} disabled={loading} >Yeet!</Button>
                    </div>
                </div>
                <div className='w-full flex grow whitespace-pre overflow-hidden' {...THEME.ACTIVE}>
                    <Card {...THEME.ACTIVE} className=''>
                        <p>Response</p>
                        <Scroll className="flex flex-col grow h-full w-full">
                            <ReactJsonView src={{ object: response }} theme='tomorrow' className='' />
                        </Scroll>
                    </Card>
                    <Card className="flex flex-col gap-5 grow overflow-auto" {...THEME.ACTIVE}>
                        <p>PAY-LOAD</p>
                        <TextArea {...THEME.MATRIX} value={body} className='grow' onChange={handleBodyChange} />
                    </Card>
                </div>
            </div>
        </div >
    )
}
export default Main;