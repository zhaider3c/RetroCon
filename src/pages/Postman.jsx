/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Input, Popup, TextArea } from 'pixel-retroui';
import { THEME } from './Theme';
import Scroll from '@components/Scroll';
import ReactJsonView from '@microlink/react-json-view';
import postmanBg from '@assets/postman.png';

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

    // Only keep unique values in HOSTS
    const hostEntries = [
        ...(di?.hosts ? Object.keys(di.hosts).map(x => [x, di.hosts[x].url]) : []),
        ["Production", "https://unicon-backend.cedcommerce.com"],
        ["Dev", "https://uni-backend.cifapps.com"],
    ];

    // Remove duplicate URLs, keep first occurrence
    const seenUrls = new Set();
    const uniqueHostEntries = hostEntries.filter(([_, url]) => {
        if (seenUrls.has(url)) return false;
        seenUrls.add(url);
        return true;
    });

    const HOSTS = Object.fromEntries(uniqueHostEntries);
    const [url, setUrl] = useState('/rest/v2/ping');
    const [token, setToken] = useState(localStorage.getItem('postman_token') || localStorage.getItem('token') || '');
    const [response, setResponse] = useState({});
    const [host, setHost] = useState(HOSTS.UNICON);
    const [verb, setVerb] = useState("GET");
    const [body, setBody] = useState(localStorage.getItem('post-body') || '');
    const [loading, setLoading] = useState(false);
    const [predifOpen, setPredifOpen] = useState(false);
    const [user, setUser] = useState({ name: "not_set" });
    // Keyboard event listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "b" && e.ctrlKey) {
                setPredifOpen(!predifOpen);
            }
        };

        document.body.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.removeEventListener('keydown', handleKeyDown);
        };
    }, [predifOpen]);

    useEffect(() => {
        di.getUser().then(r => {
            console.log(r);

            setUser(r);
        });
    }, []);

    // Parse JWT token safely
    const parseToken = (token) => {
        try {
            if (!token || !token.includes('.')) return {};
            const payload = token.split('.')[1];
            return JSON.parse(atob(payload));
        } catch (error) {
            console.warn('Failed to parse token:', error);
            return {};
        }
    };
    const decodedToken = parseToken(token);

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
    const handleBodyChange = (e) => {
        setBody(e.target.value);
        localStorage.setItem('post-body', e.target.value);
    };
    return (
        <div className='w-full h-full bg-no-repeat bg-cover flex flex-col justify-center items-center gap-5' style={{ backgroundImage: `url(${postmanBg})` }}>
            <div>
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

            </div>
            <div className='flex w-full grow overflow-hidden flex-col justify-between gap-3 p-3'>
                <div className='flex flex-col items-between gap-3'>
                    <div className='flex gap-3 items-center justify-between h-10'>
                        <Card {...THEME.ACTIVE} className='h-full text-sm flex flex-col items-start justify-center'>
                            <span>
                                {user?.name ?? user?.firstname ?? user?.username}
                            </span>
                            <span className='capitalize'>
                                {decodedToken?.role ?? "???"}
                            </span>
                        </Card>
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
                            let business = localStorage.getItem('business');
                            try {
                                setResponse({});
                                const response = await fetch(host === "None" ? url : host + url, {
                                    method: verb,
                                    headers: {
                                        'Authorization': 'Bearer ' + token,
                                        ...(business && business.length >= 12 ? { 'Business': business } : {}),
                                        ...(verb === 'POST' ? { 'Content-Type': 'application/json' } : {})
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
                <div className='w-full flex grow whitespace-pre' {...THEME.ACTIVE}>
                    <Card {...THEME.ACTIVE} className='overflow-hidden grow'>
                        <p className='bg-black/25 px-3 w-full py-3'>Response</p>
                        <div className='flex flex-col h-128 w-full'>
                            <Scroll className="h-full w-full">
                                <ReactJsonView src={{ object: response }} theme='tomorrow' className='' />
                            </Scroll>
                        </div>
                    </Card>
                    {

                        (verb == 'POST' || verb == 'PUT' || verb == 'PATCH') && (<Card className="flex flex-col gap-5 grow overflow-auto" {...THEME.ACTIVE}>
                            <p>PAY-LOAD</p>
                            <TextArea {...THEME.MATRIX} value={body} className='grow' onChange={handleBodyChange} />
                        </Card>)
                    }
                </div>
            </div>
        </div >
    )
}
export default Main;