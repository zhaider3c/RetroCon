/* eslint-disable react/prop-types */

import { Button, Card, Input } from "pixel-retroui";
import { THEME } from "./Theme";
import { useEffect, useState } from "react";
import Form from "@components/Form";
import BG from '@assets/login.gif'


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
                        localStorage.setItem('business', 'admin');
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
            <p className="text-2xl">Login</p>
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
    const [hosts, setHosts] = useState(() => {
        // Ensure we have a deep copy so edits don't mutate di.hosts directly
        return JSON.parse(JSON.stringify(di.hosts));
    });
    const [modified, setModified] = useState(false);

    useEffect(() => {
        setModified(JSON.stringify(hosts) !== JSON.stringify(di.hosts));
    }, [hosts, di.hosts]);

    return (
        <div className="flex flex-col items-end gap-5 p-5 w-full">
            <div className="flex justify-between items-center gap-5 w-full">
                <p className="text-2xl">
                    Backend Hosts
                    {modified ? <span className="text-yellow-500 text-sm"> Modified</span> : ""}
                </p>
                <div className="flex justify-center items-center gap-5">
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
            {Object.keys(hosts).map((hostKey, idx) => {
                // Each host is an object: { url: string, token: string }
                // For backward compatibility, if value is a string, treat as url, token empty
                const hostValue = hosts[hostKey];
                let url = "";
                let token = "";
                if (typeof hostValue === "string") {
                    url = hostValue;
                    token = "";
                } else if (typeof hostValue === "object" && hostValue !== null) {
                    url = hostValue.url || "";
                    token = hostValue.token || "";
                }
                return (
                    <div className="flex flex-col gap-0 w-full border-2! border-white/25! rounded-xl p-2" key={idx}>
                        <div className="flex items-center gap-5 w-full">
                            <Input
                                {...THEME.ACTIVE_INPUT}
                                className="text-center"
                                value={hostKey}
                                disabled
                                readOnly
                            />
                            <Card {...THEME.ACTIVE} className="flex h-12 justify-center items-center gap-0 grow p-0">
                                <span>https://</span>
                                <Input
                                    {...THEME.SEAMLESS}
                                    className="grow"
                                    value={url.replace(/^https:\/\//, "").replace(/\.com$/, "")}
                                    onChange={e => {
                                        const newHosts = { ...hosts };
                                        const newUrl = "https://" + e.target.value + ".com";
                                        if (typeof newHosts[hostKey] === "object" && newHosts[hostKey] !== null) {
                                            newHosts[hostKey] = { ...newHosts[hostKey], url: newUrl };
                                        } else {
                                            // backward compatibility
                                            newHosts[hostKey] = newUrl;
                                        }
                                        setHosts(newHosts);
                                    }}
                                />
                                <span>.com</span>
                            </Card>
                        </div>
                        <div className="flex items-center gap-5 w-full ">
                            <Input
                                {...THEME.ACTIVE_INPUT}
                                className="grow"
                                value={token}
                                placeholder="App token (optional)"
                                onChange={e => {
                                    const newHosts = { ...hosts };
                                    if (typeof newHosts[hostKey] === "object" && newHosts[hostKey] !== null) {
                                        newHosts[hostKey] = { ...newHosts[hostKey], token: e.target.value };
                                    } else {
                                        // backward compatibility: convert to object
                                        newHosts[hostKey] = { url: url, token: e.target.value };
                                    }
                                    setHosts(newHosts);
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

function Secret({ di }) {
    return (
        <div className="flex flex-col items-center justify-center gap-5 w-full ">
            <Button {...THEME.SUCCESS} onClick={() => {
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
                            localStorage.setItem('business', 'admin');
                            di.navigate("/message?message=Login+Success&forward=/admin&token=" + res.data.token);
                        } else {
                            di.toast.error("Admin login failed");
                        }
                    }
                });
            }}>Login as admin</Button>
        </div>
    )
}

const Main = ({ di }) => {
    const [tab, setTab] = useState("login");
    const activeColor = THEME.ACTIVE.bg;
    const inactiveColor = THEME.SECONDARY.bg;

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
            label: "Host config",
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
                            return <div onClick={() => setTab(x.value)} className='py-3 px-5 m-0 rounded-md'
                                style={{ backgroundColor: tab === x.value ? activeColor : inactiveColor }}>{x.label}</div>
                        })}
                    </div>
                </div>
                <div style={{ marginTop: "0px", borderTop: "none", backgroundColor: THEME.ACTIVE.bg }} className="min-w-256 flex flex-col items-start gap-5 p-5">
                    {tabs.find(x => x.value === tab)?.component}
                </div>
            </Card>
        </div>
    )
};
export default Main;