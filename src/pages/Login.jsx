/* eslint-disable react/prop-types */

import { THEME } from "./Theme";
import BG from '@assets/login.gif'
import Form from "@components/Form";
import Slider from "@components/Slider";
import Runner from '@assets/runner.gif'
import Shield from '@assets/shield.png'
import { useEffect, useState } from "react";
import { IoSettings } from "react-icons/io5";
import SCROLL_LEFT from '@assets/scroll-left.png'
import SCROLL_RIGHT from '@assets/scroll-right.png'
import SCROLL_CENTER from '@assets/scroll-center.png'
import { Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Input } from "pixel-retroui";


function LoginForm({ di }) {

    function onSubmit(data) {
        di.request.post({
            url: di.api.get('login'),
            body: JSON.stringify({
                // if @ not in email then it's a username
                ...(data.email && data.email.includes('@')
                    ? { email: data.email }
                    : { username: data.email }),
                password: data.password
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + di.hosts.UNICON.token
            },
            callback: (res) => {
                if (res.success) {
                    if (data.email == 'admin') {
                        localStorage.setItem('business', res.user_id);
                    }
                    di.navigate("/message?message=Login+Success&token=" + res.data.token);
                } else {
                    di.toast.error("Login failed: " + res.data.message);
                }
            }
        });
    }

    return (
        <div className="h-full flex flex-col justify-center items-center grow gap-5 w-full rounded-xl p-3 backdrop-blur-sm">
            <p className="text-sm text-start w-full">Server: {di.hosts.UNICON.url}</p>
            <Form
                fields={{
                    email: {
                        label: "Email",
                        type: "text",
                        placeholder: "Megan@fox.com"
                    },
                    password: {
                        label: "Password",
                        type: "password",
                        placeholder: "Its a secret!"
                    }
                }}
                onSubmit={onSubmit} submitText="Login" />
        </div>);
}

function TokenLoginForm({ di }) {
    return (<div className="w-full flex flex-col items-start gap-5">
        <Form
            fields={{
                token: {
                    label: "Login with token",
                    type: "textarea",
                    placeholder: "Enter your token here",
                    cols: 25,
                    rows: 10
                }
            }}
            onSubmit={(data) => {
                di.navigate("/message?message=Login+Success&token=" + data.token)
            }}
            submitText="Login"
        />
    </div>);
}

function ServerSelector({ di }) {
    const appUrls = di.url_profiles;
    const [hosts, setHosts] = useState(() => {
        // Ensure we have a deep copy so edits don't mutate di.hosts directly
        return JSON.parse(JSON.stringify(di.hosts));
    });
    const [modified, setModified] = useState(false);
    const [isOnecon, setIsOnecon] = useState(true);

    useEffect(() => {
        setModified(JSON.stringify(hosts) !== JSON.stringify(di.hosts));
    }, [hosts, di.hosts]);

    function Multicon() {
        return (
            Object.keys(hosts).map((hostKey, idx) => {
                return (
                    <div className="grid grid-cols-2 w-full bg-white/10 rounded-xl p-3" key={idx}>
                        <div className="flex flex-col gap-5 col-span-1">
                            <p className="text-green-400 font-black">{hostKey.toUpperCase()}</p>
                            <div className="flex items-center gap-5 w-full">
                                <div>
                                    {(() => {
                                        try {
                                            const token = hosts[hostKey].token;
                                            if (!token || typeof token !== "string" || token.split('.').length !== 3) {
                                                return <span className="text-sm text-white/50">No token</span>;
                                            }
                                            const payload = token.split('.')[1];
                                            // Add padding if needed for base64 decoding
                                            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
                                            const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
                                            const decoded = atob(padded);
                                            return <span className="text-sm text-white/50">Token: {JSON.parse(decoded)?.role?.toUpperCase() + " "}
                                                Valid till: {JSON.parse(decoded).exp ?? "forever"}</span>;
                                        } catch (e) {
                                            return <span className="text-sm text-white/50">Invalid token</span>;
                                        }
                                    })()}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between items-start gap-3 col-span-1">
                            <DropdownMenu {...THEME.ACTIVE} className="grow w-full">
                                <DropdownMenuTrigger {...THEME.ACTIVE} className="w-64">{hosts[hostKey].type.toUpperCase() ?? "Not Selected"}</DropdownMenuTrigger>
                                <DropdownMenuContent {...THEME.SECONDARY} className="w-96">
                                    {Object.keys(appUrls).map((url, idx) => {
                                        return <DropdownMenuItem {...THEME.ACTIVE} className="cursor-pointer" key={idx} >
                                            <div onClick={() => {
                                                const newHosts = { ...hosts };
                                                newHosts[hostKey] = { url: "https://" + appUrls[url].url, token: appUrls[url].token, type: url };
                                                setHosts(newHosts);
                                            }} className="flex justify-start items-center gap-0 px-3 py-1 hover:bg-white/10 rounded-xl">
                                                {url.toUpperCase()}
                                            </div>
                                        </DropdownMenuItem>
                                    })}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <div className="flex justify-end items-center gap-0 grow text-green-400">
                                {hosts[hostKey].url}
                            </div>
                        </div>
                    </div>
                );
            })
        );

    }

    function Onecon() {
        const hostKey = "UNICON";
        const decodedToken = () => {
            let data = null;
            try {
                const token = atob(hosts[hostKey]?.token.split('.')[1]);
                data = JSON.parse(token);
                return data;
            } catch (e) {                
                return false;
            }
        };
        return (
            <div className="flex flex-col gap-5 grow p-5 m-3 bg-white/10 rounded-xl">
                <div className="flex gap-5 items-center justify-center">
                    <div className="flex flex-col gap-5 items-start justify-center">
                        <DropdownMenu {...THEME.ACTIVE} style={{ border: "0.4rem solid transparent" }}>
                            <DropdownMenuTrigger {...THEME.ACTIVE} className="w-48">{hosts[hostKey].type.toUpperCase() ?? "Not Selected"}</DropdownMenuTrigger>
                            <DropdownMenuContent {...THEME.SECONDARY} className="">
                                {Object.keys(appUrls).map((url, idx) => {
                                    return <DropdownMenuItem {...THEME.ACTIVE} className="cursor-pointer" key={idx} >
                                        <div onClick={() => {
                                            const newHosts = { ...hosts };
                                            for (let i of Object.keys(newHosts)) {
                                                newHosts[i] = { url: "https://" + appUrls[url].url, token: appUrls[url].token, type: url };
                                            }
                                            setHosts(newHosts);
                                        }} className="flex justify-start items-center gap-0 px-3 py-1 hover:bg-white/10 rounded-xl">
                                            {url.toUpperCase()}
                                        </div>
                                    </DropdownMenuItem>
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="w-fit text-green-400">
                        {Object.keys(hosts).map((x, i) => {
                            return (
                                <div key={i} className="grid grid-cols-4">
                                    <p className="col-span-1">{x.toUpperCase()}</p>
                                    <p className="col-span-3">{hosts[x].url}</p>
                                </div>)
                        })}
                    </div>
                </div>
                <div className="flex gap-5 items-start justify-start w-full">
                    {decodedToken() && <div>
                        <p>Role: {decodedToken().role?.toUpperCase()}</p>
                        <p>User ID: {decodedToken().user_id}</p>
                        <p>Valid till: {decodedToken().exp || "forever"}</p>
                    </div>}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col grow">
            <div className="flex justify-between items-center gap-5 w-full">
                <p className="text-2xl">
                    Server Configuration
                    {modified ? <span className="text-yellow-500 text-sm"> Modified</span> : ""}
                </p>
                <div className="flex justify-center items-center gap-5">
                    <label className="text-sm">Micro Service</label>
                    <Slider {...THEME.SECONDARY} onClick={(e) => {
                        setIsOnecon(e.checked);
                    }} />
                    <Button
                        {...THEME.SUCCESS}
                        className="items-end justify-center flex w-24 h-8 font-black text-xl"
                        onClick={() => {
                            di.hosts = hosts;
                            localStorage.setItem("hosts", JSON.stringify(hosts));
                            setModified(false);
                            di.toast.success("Hosts saved");
                        }}
                    >
                        Save
                    </Button>
                </div>
            </div>
            <div className="w-full grow flex flex-col gap-5">
                {!isOnecon ? <Multicon /> : <Onecon />}
            </div>
        </div >
    )
}

function Secret({ di }) {
    const [tnc, setTnc] = useState(false);
    const login = (
        <div className="flex flex-col items-center justify-center gap-5 w-full">
            <button
                className="flex flex-col justify-center items-center w-64 h-48 gap-5 bg-contain bg-no-repeat bg-center"
                style={
                    {
                        backgroundImage: `url(${Shield})`,
                    }
                }
                onClick={(e) => {
                    e.target.style.backgroundImage = `url(${Runner})`;
                    di.request.post({
                        url: di.api.get('login'),
                        body: JSON.stringify({
                            username: 'admin',
                            password: 'p@@sw@@rd@289'
                        }),
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + di.hosts.UNICON.token
                        },
                        callback: (res) => {
                            if (res.success) {
                                localStorage.setItem('business', res.user_id);
                                di.navigate("/message?message=Login+Success&forward=/admin&token=" + res.data.token);
                            } else {
                                di.toast.error("Admin login failed");
                            }
                        }
                    });
                }}
            >
            </button>
            <span className="text-xl text-amber-600">Summon the Admin</span>
        </div>
    );
    const beware = (
        <div className="flex h-full items-center justify-center gap-0 w-full"
            onMouseEnter={(e) => {
                let elem = e.target.querySelectorAll('div')[1];
                if (elem) {
                    elem.style.width = '48rem';
                }
            }} onMouseLeave={(e) => {
                let elem = e.target.querySelectorAll('div')[1];
                if (elem) {
                    elem.style.width = '0px';
                }
            }}>
            <div style={{ backgroundImage: `url(${SCROLL_LEFT})` }} className="h-48 w-4 bg-no-repeat bg-start bg-center"></div>
            <div style={
                {
                    backgroundImage: `url(${SCROLL_CENTER})`,
                    width: '0px',
                    transition: 'all 0.3s linear'
                }
            }
                className={`h-48 bg-repeat-x bg-start bg-center text-sm justify-center items-start flex flex-col text-black overflow-hidden whitespace-nowrap`}>
                <span>Beyond this threshold slumbers the forbidden might of the Admin.</span>
                <span>Such power festers, gnawing at the mind, warping all resolve.</span>
                <span>It sunders servers, near and distant, leaving only ruin in its wake.</span>
                <span className="text-red-600">Turn back, foul tarnished, lest madness claim thee.</span>
                <label className="w-full flex items-center justify-end gap-2 ">
                    <input type="checkbox" className="accent-amber-800!" onChange={() => setTnc(!tnc)} />
                    I accept this accursed burden.
                </label>
            </div>
            <div style={{ backgroundImage: `url(${SCROLL_RIGHT})` }} className="h-48 w-4 bg-no-repeat bg-start bg-center"></div>
        </div>
    )
    return (<div className="h-64 w-full">{
        tnc ? login : beware
    }
    </div >
    );
}

const Main = ({ di }) => {
    const [tab, setTab] = useState("login");
    const activeColor = THEME.ACTIVE.bg;
    const inactiveColor = THEME.SECONDARY.bg;
    localStorage.removeItem("business");
    const tabs = [
        {
            label: "Login",
            value: "login",
            component: <LoginForm di={di} />
        },
        {
            label: "Admin",
            value: "secret",
            component: <Secret di={di} />
        },
        {
            label: "Login with token",
            value: "token",
            component: <TokenLoginForm di={di} />
        },
        {
            label: <span className="flex items-center gap-2"><IoSettings /> Server Config</span>,
            value: "host",
            component: <ServerSelector di={di} />
        },
    ]

    return (
        <div className="w-full h-full flex justify-center items-center bg-no-repeat bg-bottom bg-cover p-5" style={{ backgroundImage: `url(${BG})` }}>
            <Card {...THEME.ACTIVE} style={{ margin: '0px', padding: '0px' }} className="flex flex-col justify-between items-stretched p-5" >
                <div className="text-white flex flex-col items-start gap-5" style={{ margin: "0px", backgroundColor: THEME.SECONDARY.bg }}>
                    <div className="flex justify-start items-center w-full gap-0 p-0" style={{ margin: "0px" }}>
                        {tabs.map((x) => {
                            return <div key={x.value} onClick={() => setTab(x.value)} className='py-3 px-5 m-0 rounded-md cursor-pointer'
                                style={{ backgroundColor: tab === x.value ? activeColor : inactiveColor }}>{x.label}</div>
                        })}
                    </div>
                </div>
                <div style={{ marginTop: "0px", borderTop: "none", backgroundColor: THEME.ACTIVE.bg }} className="min-w-256 flex items-start gap-5 p-5">
                    {tabs.find(x => x.value === tab)?.component}
                </div>
            </Card>
        </div>
    )
};
export default Main;