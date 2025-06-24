/* eslint-disable react/prop-types */

import { Button, Input, TextArea } from "pixel-retroui";
import { THEME } from "./Theme";
import { useState } from "react";

function LoginForm({ di }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-5">
            <div className="w-full flex flex-col items-start gap-5">
                <span className="text-xl">Email</span>
                <Input {...THEME.ACTIVE_INPUT}
                    name="email"
                    className="w-full"
                    placeholder="Enter your username"
                />
                <span className="text-xl">Password</span>
                <Input {...THEME.ACTIVE_INPUT}
                    name='password'
                    type="password"
                    className="w-full"
                    placeholder="Enter your password"
                    onFocus={(e) => { e.target.type = 'text' }}
                    onBlur={(e) => { e.target.type = 'password' }}
                />
                <Button {...THEME.SECONDARY} className="px-5" onClick={() => {
                    di.request.post({
                        url: di.api.get('login'),
                        body: JSON.stringify({
                            email: document.querySelector('input[name="email"]').value,
                            password: document.querySelector('input[name="password"]').value
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
                }}>
                    Submit
                </Button>
            </div>
            <div className="w-1/2 flex flex-col items-start gap-5">
                <span className="text-xl">TOKEN </span>
                <TextArea className="grow" onChange={(e) => (setToken(e.target.value))}></TextArea>
                <div className="flex w-full items-end justify-end">
                    <Button {...THEME.SECONDARY} className="px-5" onClick={
                        () => {
                            di.navigate("/message?message=Login+Success&token=" + token)
                        }
                    }> Login </Button>
                </div>
            </div>
        </div>);
}

const Main = ({ di }) => {
    const [token, setToken] = useState("");
    if (localStorage.getItem("token")) {
        di.navigate("/business");
    } else {
    }
    return (
        <div className="w-full h-full bg-blue-700 flex flex-col justify-center items-center gap-5">
            <LoginForm di={di} />
        </div>
    );
};
export default Main;