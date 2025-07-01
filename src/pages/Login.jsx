/* eslint-disable react/prop-types */

import { Button, Card, Input, TextArea } from "pixel-retroui";
import { THEME } from "./Theme";
import { useEffect, useRef, useState } from "react";
import Form from "@components/Form";
import BG from '@assets/login.gif'
import { MdOutlineAdd, MdOutlineRemove } from "react-icons/md";
import Minus from '@assets/minus.svg'
import { BiTrash } from "react-icons/bi";
import { FaPlusSquare, FaTrash, FaTrashAlt } from "react-icons/fa";

function LoginForm({ di }) {
    function onSubmit(data) {
        di.request.post({
            url: di.api.get('login'),
            body: JSON.stringify({
                email: data.email,
                password: data.password
            }),
            headers: {
                "Content-Type": "application/json"
            },
            callback: (res) => {
                if (res.success) {
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
    const [hosts, setHosts] = useState(di.hosts)
    let modified = false;
    useEffect(() => {
        modified = JSON.stringify(hosts) != JSON.stringify(di.hosts);
    }, [hosts]);
    return (
        <div className="flex flex-col items-end gap-5 p-5 w-full">
            <div className="flex justify-between items-center gap-5 w-full">
                <p className="text-2xl">Backend Hosts
                    {
                        !modified ?
                            "" : <span className="text-yellow-500 text-sm"> Modified</span>}
                </p>
                <div className="flex justify-center items-center gap-5">
                    <Button {...THEME.SUCCESS} className="items-end justify-center flex w-24 h-8" onClick={() => {
                        setHosts({ ...hosts, "New Host": "" })
                    }}>
                        <FaPlusSquare className="text-2xl text-center text-lime-800 font-black" />
                    </Button>
                    <Button {...THEME.SUCCESS} className="items-end justify-center flex w-24 h-8 font-black text-xl"
                        onClick={() => {
                            di.hosts = hosts;
                            localStorage.setItem("hosts", JSON.stringify(hosts));
                            setHosts(di.hosts);
                            di.toast.success("Hosts saved");
                            console.log(di.hosts, hosts, JSON.stringify(hosts) == JSON.stringify(di.hosts));
                        }}
                    >
                        Save
                    </Button>
                </div>
            </div>
            {Object.keys(hosts).map((x, y) => {
                return (
                    <div className="flex justify-center items-center gap-5 w-full" key={y}>
                        <Input {...THEME.ACTIVE_INPUT} className="text-center" value={x} onChange={(e) => {
                            const newHosts = { ...hosts };
                            delete newHosts[x];
                            newHosts[e.target.value] = hosts[x];
                            setHosts(newHosts);
                        }} />
                        <Card {...THEME.ACTIVE} className="flex justify-center items-center gap-0 grow p-0">
                            <span>https://</span>
                            <Input {...THEME.SEAMLESS} className="grow" value={hosts[x].replace("https://", "").replace(".com", "")} onChange={(e) => {
                                const newHosts = { ...hosts };
                                newHosts[x] = "https://" + e.target.value + ".com";
                                setHosts(newHosts);
                            }} />
                            <span>.com</span>
                        </Card>
                        <Button {...THEME.TRANSPARENT} className="w-10 h-10 items-center justify-center" onClick={() => {
                            const newHosts = { ...hosts };
                            delete newHosts[x];
                            setHosts(newHosts);
                        }}>
                            <FaTrashAlt className="text-2xl text-center text-red-700 font-black" />
                        </Button>
                    </div>
                )
            })}
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
            value: "login"
        },
        {
            label: "Login with token",
            value: "token"
        },
        {
            label: "Host config",
            value: "host"
        }
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
                    {tab === "login" && <LoginForm di={di} />}
                    {tab === "token" && <TokenLoginForm di={di} />}
                    {tab === "host" && <ServerSelector di={di} />}
                </div>
            </Card>
        </div>
    )
};
export default Main;