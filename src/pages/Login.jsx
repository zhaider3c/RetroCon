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
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        <div className="h-full flex flex-col justify-center items-center grow gap-5 rounded-xl p-3 backdrop-blur-sm">
            <div className="w-3/4 flex flex-col grow items-start gap-5">
                <Card {...THEME.SECONDARY} className="w-full flex flex-col items-start gap-5 p-5">
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
                </Card>
            </div>
            <div className="w-full flex flex-col items-start gap-5">
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
            </div>
        </div>);
}

function ServerSelector({ di }) {
    const [hosts, setHosts] = useState(di.hosts)
    return (
        <div className="grow h-full flex flex-col justify-center items-center gap-5">
            <Card {...THEME.SECONDARY} className="w-3/4 flex flex-col items-end gap-5 p-5">
                <div className="flex justify-between items-center gap-5 w-full">
                    <p className="text-2xl">Backend Hosts
                        {
                            JSON.stringify(hosts) == JSON.stringify(di.hosts) ?
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
                                di.toast.success("Hosts saved");
                                setHosts(di.hosts);
                            }}
                        >
                            Save
                        </Button>
                    </div>
                </div>
                {Object.keys(hosts).map((x, y) => {
                    return (
                        <div className="flex justify-center items-center gap-5 w-full" key={y}>
                            <Input {...THEME.ACTIVE_INPUT} className="text-center" value={x} />
                            <Input {...THEME.ACTIVE} className="grow" value={hosts[x]} />
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

            </Card>
        </div>
    )
}

const Main = ({ di }) => {
    const [token, setToken] = useState("");
    if (localStorage.getItem("token")) {
        di.navigate("/business");
    }
    return (
        <div className="w-full h-full flex justify-center items-center gap-5 bg-no-repeat bg-bottom bg-cover p-5" style={{ backgroundImage: `url(${BG})` }}>
            <ServerSelector di={di} />
            <LoginForm di={di} />
        </div>
    );
};
export default Main;