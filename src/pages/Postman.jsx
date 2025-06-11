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

const Main = ({ di }) => {
    const [url, setUrl] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('postman_token') || localStorage.getItem('token') || '');
    const [response, setResponse] = useState(null);
    const [autoRefresh, setAutoRefresh] = useState(null);
    const [host, setHost] = useState("None");
    const [verb, setVerb] = useState("GET");
    const [body, setBody] = useState(localStorage.getItem('post-body') || '');
    const [loading, setLoading] = useState(false);

    // Debounce function helper
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    // Debounced handlers
    const handleUrlChange = debounce((e) => setUrl(e.target.value), 7);
    const handleTokenChange = debounce((e) => {
        setToken(e.target.value);
        localStorage.setItem('postman_token', e.target.value);
    }, 7);
    const handleBodyChange = debounce((e) => {
        setBody(e.target.value);
        localStorage.setItem('post-body', e.target.value);
    }, 7);
    return (
        <div className='w-full h-full bg-[url("/postman.png")] bg-no-repeat bg-cover flex flex-col justify-center items-center gap-5'>
            <div className='flex w-full h-full flex-col gap-3 p-5'>
                <div className='flex flex-col items-center gap-3'>
                    <div className='w-full flex gap-3 items-center'>
                        <Input {...THEME.ACTIVE_INPUT} placeholder='Token' className='w-full' value={token} onChange={handleTokenChange} />
                    </div>
                    <div className='w-full flex gap-3 items-center justify-center'>
                        <DropdownMenu {...THEME.ACTIVE} className='px-1'>
                            <DropdownMenuTrigger >
                                {host ?? "Select Host"}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent {...THEME.SECONDARY}>
                                {
                                    Object.keys(di.hosts
                                    ).map((x, u) => {
                                        return (
                                            <DropdownMenuItem key={u}>
                                                <Button data-host={di.hosts[x]} onClick={(e) => {
                                                    setHost(e.target.getAttribute('data-host'))
                                                }}>
                                                    {di.hosts[x]}
                                                </Button>
                                            </DropdownMenuItem>
                                        )
                                    })
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu {...THEME.ACTIVE} className='px-1'>
                            <DropdownMenuTrigger>
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
                        <Input {...THEME.ACTIVE_INPUT} placeholder='/rest/v2/ping' onChange={handleUrlChange} className='grow' />
                        <Button {...(loading ? THEME.BLOCKED : THEME.ACTIVE)} onClick={async () => {
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
                    <Card {...THEME.MATRIX} className=''>
                        <Scroll className="flex flex-col grow h-full w-full">
                            <ReactJsonView src={{ object: response }} theme='tomorrow' className='' />
                        </Scroll>
                    </Card>
                    <Card className="flex flex-col gap-5 grow overflow-auto" {...THEME.ACTIVE}>
                        <p>PAY-LOAD</p>
                        <TextArea {...THEME.MATRIX} value={body} className='grow' onChange={(e) => {
                            setBody(e.target.value);
                            localStorage.setItem('post-body', e.target.value);
                        }} />
                    </Card>
                </div>
            </div>
        </div >
    )
}
export default Main;