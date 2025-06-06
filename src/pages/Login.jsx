/* eslint-disable react/prop-types */

import { Button, Input, TextArea } from "pixel-retroui";
import { THEME } from "./Theme";
import { useState } from "react";

const Main = ({ di }) => {
    const [token, setToken] = useState("");
    if (localStorage.getItem("token")) {
        window.location = "/business";
    } else {
        console.log("no token");
    }
    return (
        <div className="w-full h-full bg-blue-700 flex flex-col justify-center items-center gap-5">
            <div className="w-1/2 flex flex-col items-start gap-5">
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
                    onFocus={(e) => {e.target.type='text'}}
                    onBlur={(e) => {e.target.type='password'}}
                />
                <Button {...THEME.MUDDY} className="px-5" onClick={() => {
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
                                window.location = "/message?message=Login+Success&token=" + res.data.token;
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
                    <Button {...THEME.MUDDY} className="px-5" onClick={
                        () => {
                            window.location = "/message?message=Login+Success&token=" + token
                        }
                    }> Login </Button>
                </div>
            </div>
        </div>
    );
};
export default Main;