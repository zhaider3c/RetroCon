/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Input, Popup, TextArea } from 'pixel-retroui';
import { THEME } from './Theme';
import Scroll from '@components/Scroll';
import ReactJsonView from '@microlink/react-json-view';
import transmitterBg from '@assets/transmitter.png';
import { PiBracketsCurlyLight } from 'react-icons/pi';
import { FiRefreshCcw } from 'react-icons/fi';
import { MdOutlineManageSearch } from 'react-icons/md';

const VERBS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const PRESETS = {
    'Cache Flush': '/rest/v2/cache/flush-all',
    'Get Config': '/rest/v2/system/config',
};

const MAX_ENDPOINTS = 10;

function getMethodBadge(method) {
    const styles = {
        GET: "bg-green-500/25 border-green-500!",
        POST: "bg-blue-500/25 border-blue-500!",
        PUT: "bg-yellow-500/25 border-yellow-500!",
        PATCH: "bg-purple-500/25 border-purple-500!",
        DELETE: "bg-red-500/25 border-red-500!",
        default: "bg-gray-500/25 border-gray-500!"
    };
    const style = styles[method?.toUpperCase()] || styles.default;
    const label = method ? method.toUpperCase() : '';
    return (
        <div className={`flex items-center w-24 justify-center border-2! ${style} px-3 py-1 rounded-md`}>
            {label}
        </div>
    );
}

function TransmitterTopBar({
    user,
    decodedToken,
    verb,
    setVerb,
    host,
    setHost,
    hosts,
    url,
    onUrlChange,
    onUrlKeyDown,
    loading,
    onSend,
    di,
    history,
}) {
    const [endpoints, setEndpoints] = useState([]);
    const [search, setSearch] = useState('');
    const [endpointsOpen, setEndpointsOpen] = useState(false);
    const [filteredEndpoints, setFilteredEndpoints] = useState([]);

    useEffect(() => {
        di.request.get({
            url: di.api.get('cache') + "?type=routes",
            callback: (res) => {
                let data = {};
                // Merge and optimize: flatten, reduce, and compact.
                const fData = Object.values(res.data.route)
                    .flatMap(routeGroup =>
                        Object.entries(routeGroup)
                            .flatMap(([method, endpoints]) =>
                                Object.entries(endpoints).map(([route]) => ({
                                    method,
                                    route
                                }))
                            )
                    );
                setEndpoints(fData);
            }
        })
    }, []);

    useEffect(() => {
        let filteredEndpoints = endpoints.filter(x => x.route.toLowerCase().includes(search.toLowerCase()));
        if (!search || search.length <= 0) {
            // filteredEndpoints = filteredEndpoints.slice(0, MAX_ENDPOINTS);
            filteredEndpoints = filteredEndpoints.filter(x => {
                let hist = Object.values(history).map(y => {
                    return y.replace('/rest/v2/', '').split("?")[0].toLowerCase();
                });
                return hist.includes(x.route.replace('v2/', '').split("?")[0].toLowerCase());
            });
        }
        setFilteredEndpoints(filteredEndpoints);
    }, [search, endpoints]);
    return (
        <div className="flex gap-3 items-center justify-between h-10">
            <Popup {...THEME.SECONDARY} isOpen={endpointsOpen} onClose={() => setEndpointsOpen(false)}>
                <div className="flex flex-col gap-5 p-5 w-256">
                    <Input {...THEME.ACTIVE_INPUT} placeholder="Search" className='w-full' onChange={(e) => setSearch(e.target.value)} />
                    <Card {...THEME.ACTIVE} className="flex flex-col justify-start items-start gap-3 h-96 overflow-auto w-full">
                        <Scroll className="h-full w-full">
                            {
                                filteredEndpoints.map((x, u) => (
                                    <div
                                        key={u}
                                        className="grid grid-cols-[auto_1fr] py-1 items-start justify-start gap-5 overflow-hidden h-fit hover:bg-white/10 cursor-pointer"
                                        {...THEME.TRANSPARENT}
                                        data-endpoint={x.route + "::" + x.method}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            let endpoint = e.target.getAttribute('data-endpoint').split('::')[0];
                                            let method = e.target.getAttribute('data-endpoint').split('::')[1];
                                            if (!endpoint.includes('v2/')) {
                                                endpoint = '/v2/' + endpoint;
                                            }
                                            if (!endpoint.includes('rest/')) {
                                                endpoint = '/rest/' + endpoint;
                                            }
                                            onUrlChange({ target: { value: endpoint } }, method)
                                            setEndpointsOpen(false);
                                        }}
                                    >
                                        <div className="flex items-center justify-center col-span-1 pointer-events-none">
                                            {getMethodBadge(x.method)}
                                        </div>
                                        <div className="flex items-center justify-start h-full pointer-events-none">
                                            <p>{x.route}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </Scroll>
                    </Card>
                </div>
            </Popup>
            <Card {...THEME.ACTIVE} className="h-full text-sm flex flex-col items-start justify-center">
                <span>{user?.name ?? user?.firstname ?? user?.username}</span>
                <span className="capitalize">{decodedToken?.role ?? '???'}</span>
            </Card>
            <DropdownMenu {...THEME.ACTIVE} className="px-1 h-full">
                <DropdownMenuTrigger className="h-full">{verb ?? '---'}</DropdownMenuTrigger>
                <DropdownMenuContent {...THEME.SECONDARY} className="">
                    {VERBS.map((x, u) => (
                        <DropdownMenuItem key={u} className="w-32 flex">
                            <Button data-host={x} className="grow" onClick={() => setVerb(x)}>
                                {x}
                            </Button>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu {...THEME.ACTIVE} className="px-1 h-full">
                <DropdownMenuTrigger className="h-full">{host ?? 'Select Host'}</DropdownMenuTrigger>
                <DropdownMenuContent {...THEME.SECONDARY} className="w-96 grid grid-cols-1 justify-center items-center gap-3">
                    {Object.keys(hosts).map((x, u) => (
                        <DropdownMenuItem key={u} className="overflow-hidden grid grid-cols-1 justify-center items-center">
                            <div
                                data-host={hosts[x]}
                                className={`w-auto hover:bg-[${THEME.POP.bg}]`}
                                onClick={(e) => setHost(e.target.getAttribute('data-host'))}
                            >
                                {hosts[x].replace('https://', '')}
                            </div>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            <Card {...THEME.ACTIVE} className="grow h-full flex items-center justify-center">
                <Input
                    {...THEME.SEAMLESS}
                    placeholder="/rest/v2/ping"
                    onChange={onUrlChange}
                    onKeyDown={onUrlKeyDown}
                    value={url}
                    className="grow h-full flex items-center justify-center"
                />
                <Button {...THEME.SEAMLESS} className="h-full items-center justify-center flex" onClick={() => setEndpointsOpen(true)}>
                    <MdOutlineManageSearch className="text-4xl text-zinc-500 hover:text-zinc-400" />
                </Button>
            </Card>
            <Button
                {...(loading ? THEME.BLOCKED : THEME.ACTIVE)}
                className="h-full"
                onClick={onSend}
                disabled={loading}
            >
                <div>
                    {loading ? (
                        <FiRefreshCcw className="text-2xl text-green-500" />
                    ) : (
                        <span>Yeet!</span>
                    )}
                </div>
            </Button>
        </div>
    );
}

function TransmitterMainArea({ response, verb, body, onBodyChange, di }) {
    return (
        <div className="w-full flex whitespace-pre" {...THEME.ACTIVE}>
            <Card {...THEME.ACTIVE} className="overflow-hidden grow">
                <p className="bg-black/25 px-3 w-full py-3">Response</p>
                <div className="flex flex-col h-128 w-full">
                    <Scroll className="h-full w-full">
                        <ReactJsonView src={{ object: response }} theme="tomorrow" className="" />
                    </Scroll>
                </div>
            </Card>
            {(verb === 'POST' || verb === 'PUT' || verb === 'PATCH') && (
                <Card className="flex flex-col gap-5 grow overflow-auto" {...THEME.ACTIVE}>
                    <div className="flex justify-start items-center gap-3">
                        <p>Payload</p>
                        <button
                            onClick={() => {
                                try {
                                    onBodyChange({ target: { value: JSON.stringify(JSON.parse(body), null, 2) } });
                                } catch (error) {
                                    di.toast.error('Invalid JSON');
                                }
                            }}
                        >
                            <div className="flex justify-start items-center gap-3 bg-yellow-500/25 px-3 py-1 rounded-md">
                                <PiBracketsCurlyLight className="text-2xl text-yellow-500" />
                                <span className="text-sm">  Format JSON</span>
                            </div>
                        </button>
                    </div>
                    <TextArea {...THEME.MATRIX} value={body} className="grow" onChange={onBodyChange} />
                </Card>
            )}
        </div>
    );
}

const Main = ({ di }) => {
    const hostEntries = [
        ...(di?.hosts ? Object.keys(di.hosts).map((x) => [x, di.hosts[x].url]) : []),
        ['Production', 'https://unicon-backend.cedcommerce.com'],
        ['Dev', 'https://uni-backend.cifapps.com'],
    ];
    const seenUrls = new Set();
    const uniqueHostEntries = hostEntries.filter(([_, url]) => {
        if (seenUrls.has(url)) return false;
        seenUrls.add(url);
        return true;
    });
    const HOSTS = Object.fromEntries(uniqueHostEntries);

    const [url, setUrl] = useState('/rest/v2/ping');
    const [token] = useState(localStorage.getItem('transmitter_token') || localStorage.getItem('token') || '');
    const [response, setResponse] = useState({});
    const [host, setHost] = useState(HOSTS.UNICON);
    const [verb, setVerb] = useState('GET');
    const [body, setBody] = useState(localStorage.getItem('post-body') || '');
    const [loading, setLoading] = useState(false);
    const [predifOpen, setPredifOpen] = useState(false);
    const [user] = useState(di.getUser());

    let urlHistory = localStorage.getItem('transmitter_url_history')?.split(':::') ?? [];
    const historyKeyRef = useRef(urlHistory.length);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'k' && e.ctrlKey) {
                e.preventDefault();
                setPredifOpen((prev) => !prev);
            }
        };
        document.body.addEventListener('keydown', handleKeyDown);
        return () => document.body.removeEventListener('keydown', handleKeyDown);
    }, []);

    const parseToken = (t) => {
        try {
            if (!t || !t.includes('.')) return {};
            return JSON.parse(atob(t.split('.')[1]));
        } catch {
            return {};
        }
    };
    const decodedToken = parseToken(token);

    const handleUrlChange = (e, method) => {
        setUrl(e.target.value);
        if (method) setVerb(method.toUpperCase());
    }

    const handleBodyChange = (e) => {
        setBody(e.target.value);
        localStorage.setItem('post-body', e.target.value);
    };

    const handleUrlKeyDown = (e) => {
        if (urlHistory.length === 0) return;
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            historyKeyRef.current = Math.max(0, historyKeyRef.current - 1);
            setUrl(urlHistory[historyKeyRef.current] ?? url);
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            historyKeyRef.current = Math.min(urlHistory.length - 1, historyKeyRef.current + 1);
            setUrl(urlHistory[historyKeyRef.current] ?? url);
        }
    };

    const handleSend = async () => {
        setLoading(true);
        if (!urlHistory.includes(url)) {
            urlHistory.push(url);
            if (urlHistory.length > 10) urlHistory = urlHistory.slice(-10);
            localStorage.setItem('transmitter_url_history', urlHistory.join(':::'));
            historyKeyRef.current = urlHistory.length;
        }
        const business = localStorage.getItem('business');
        try {
            setResponse({});
            const target = host === 'None' ? url : host + url;
            const baseHeaders = {
                Authorization: 'Bearer ' + token,
                ...(business && business.length >= 12 ? { Business: business } : {}),
                ...(verb === 'POST' ? { 'Content-Type': 'application/json' } : {}),
            };
            const { url: finalUrl, headers: finalHeaders } = di.proxify(target, baseHeaders);
            const res = await fetch(finalUrl, {
                method: verb,
                headers: finalHeaders,
                ...(verb === 'POST' ? { body } : {}),
            });
            setResponse(await res.json());
        } catch (error) {
            setResponse({ error });
        } finally {
            setLoading(false);
        }
    };

    function getHistory() {
        const history = {};
        urlHistory.forEach((x) => { history[x.split('/').pop()] = x; });
        return history;
    }

    function getPreset() {
        return { ...PRESETS };
    }
    const presets = getPreset();

    return (
        <div
            className="w-full h-full bg-no-repeat bg-cover flex flex-col justify-center items-center gap-5"
            style={{ backgroundImage: `url(${transmitterBg})` }}
        >
            <div>
                <Popup {...THEME.ACTIVE} isOpen={predifOpen} onClose={() => setPredifOpen(false)} className="flex flex-col gap-3">
                    <h1 className="text-2xl text-center">Common URLS</h1>
                    <Card {...THEME.SECONDARY} className="grid grid-cols-1 justify-center items-center gap-3">
                        {Object.keys(presets).map((x, u) => (
                            <Button
                                key={u}
                                {...THEME.ACTIVE}
                                data-url={presets[x]}
                                onClick={(e) => {
                                    setUrl(e.target.getAttribute('data-url'));
                                    setPredifOpen(false);
                                }}
                            >
                                {x}
                            </Button>
                        ))}
                    </Card>
                </Popup>
            </div>
            <div className="flex w-full grow overflow-hidden flex-col justify-start gap-3 p-3">
                <div className="flex flex-col items-between gap-3">
                    <TransmitterTopBar
                        user={user}
                        decodedToken={decodedToken}
                        verb={verb}
                        setVerb={setVerb}
                        host={host}
                        setHost={setHost}
                        hosts={HOSTS}
                        url={url}
                        onUrlChange={handleUrlChange}
                        onUrlKeyDown={handleUrlKeyDown}
                        loading={loading}
                        onSend={handleSend}
                        di={di}
                        history={getHistory()}
                    />
                </div>
                <TransmitterMainArea
                    response={response}
                    verb={verb}
                    body={body}
                    onBodyChange={handleBodyChange}
                    di={di}

                />
            </div>
        </div>
    );
};

export default Main;