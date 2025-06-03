/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Input, Popup, TextArea } from 'pixel-retroui';
import { THEME } from './Theme';
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
    const [response, setResponse] = useState(null);
    const [autoRefresh, setAutoRefresh] = useState(null);
    const [host, setHost] = useState(null);
    const [verb, setVerb] = useState("GET");
    const [body, setBody] = useState(localStorage.getItem('post-body') || '');
    return (
        <div className='w-full h-full bg-[url("/postman.png")] bg-no-repeat bg-cover flex flex-col justify-center items-center'>
            <div className='flex w-3/4 h-full flex-col gap-5 p-5'>
                <div className='flex gap-5 items-center'>
                    <DropdownMenu {...THEME.POP}>
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
                    <DropdownMenu {...THEME.POP}>
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
                    <Input placeholder='/rest/v2/ping' onChange={(e) => setUrl(e.target.value)} className='grow'></Input>
                    <div className='h-full flex gap-3 items-center'>
                        <Button {...THEME.POP} onClick={() => {
                            di.request[verb.toLowerCase()]({
                                url: host + url,
                                callback: (r) => { setResponse(r) },
                                body:body
                            })
                        }} >Yeet!</Button>
                        {/* <Card className={'w-48 flex gap-5 items-center ' + `bg-${autoRefresh ? 'green-600' : 'amber-400'}`}>
                            <Input onChange={(e) => { setAutoRefresh(e.target.checked) }} type="checkbox" />
                            Auto Refresh
                        </Card> */}
                    </div>
                </div>
                <Card className='w-full flex flex-col grow whitespace-pre overflow-hidden' {...THEME.POP}>
                    <div className="flex flex-col grow overflow-auto">
                        <ReactJsonView src={{ object: response }} />
                    </div>
                    <div className=" flex flex-col gap-5 overflow-auto h-3/4">
                        POST DATA:
                        <TextArea {...THEME.MATRIX} value={body} className='h-full' onChange={(e) => {
                            setBody(e.target.value);
                            localStorage.setItem('post-body', e.target.value);
                        }} />
                    </div>
                </Card>
            </div>
        </div>
    )
}
export default Main;