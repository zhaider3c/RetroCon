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
    return (
        <div className='w-full h-full bg-[url("/postman.png")] bg-no-repeat bg-cover flex flex-col justify-center items-center'>
            <div className='flex w-full h-full flex-col gap-5 p-5'>
                <div className='flex flex-col gap-5 items-center'>
                    <div className='w-full flex gap-5 items-center'>
                        <Input {...THEME.ACTIVE_INPUT} placeholder='Token' className='w-full' value={token} onChange={(e) => {
                            setToken(e.target.value);
                            localStorage.setItem('postman_token', e.target.value);
                        }} />
                    </div>
                    <div className='w-full flex gap-5 items-center'>
                        <DropdownMenu {...THEME.ACTIVE}>
                            <DropdownMenuTrigger>
                                {host ?? "Select Host"}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent {...THEME.MUDDY}>
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
                        <DropdownMenu {...THEME.ACTIVE}>
                            <DropdownMenuTrigger>
                                {verb ?? "---"}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent {...THEME.MUDDY} className=''>
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
                        <Input {...THEME.ACTIVE_INPUT} placeholder='/rest/v2/ping' onChange={(e) => setUrl(e.target.value)} className='grow'></Input>
                        <div className='h-full flex gap-3 items-center'>
                            <Button {...THEME.ACTIVE} onClick={() => {
                                fetch(host === "None" ? url : host + url, {
                                    // mode: 'no-cors',
                                    method: verb,
                                    headers: {
                                        'Authorization': 'Bearer ' + token,
                                        'Content-Type': 'application/json'
                                    },
                                    ...(verb === 'POST' ? { body: body } : {})
                                }).then(response => {
                                    return response.json();
                                }).then(json => {
                                    setResponse(json);
                                }).catch(error => {
                                    console.error(error);
                                    setResponse({ error: error });
                                })
                            }} >Yeet!</Button>

                            {/* <Card className={'w-48 flex gap-5 items-center ' + `bg-${autoRefresh ? 'green-600' : 'amber-400'}`}>
                            <Input {...THEME.ACTIVE_INPUT} onChange={(e) => { setAutoRefresh(e.target.checked) }} type="checkbox" />
                            Auto Refresh
                        </Card> */}
                        </div>
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