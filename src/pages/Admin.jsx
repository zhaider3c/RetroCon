/* eslint-disable react/prop-types */

import { Button, Card, Input, TextArea } from "pixel-retroui";
import { THEME } from "./Theme";
import { useState } from "react";
import CreateApp from "@pages/admin/CreateApp";
import ChannelGroup from "@pages/admin/ChannelGroup";
import Channel from "@pages/admin/Channel";
import { IoCaretBackSharp } from "react-icons/io5";

const Nav = ({ pages, setPage }) => {
    return (
        (
            <div className="grow grid grid-cols-12 gap-5 justify-start items-between w-full">
                <div className="grid grid-cols-10 col-span-6 text-start">
                    {
                        Object.keys(pages).map((x, i) => {
                            if(x=='home') return;
                            return (
                                <Button key={x} onClick={() => {
                                    setPage(x);
                                }} className="col-span-2" {...THEME.ACTIVE}>
                                    {x.toLocaleUpperCase().replace('_', " ")}
                                </Button>
                            )
                        })
                    }
                </div>
            </div>
        )
    )
}

const Main = ({ di }) => {
    const [adminToken, setAdminToken] = useState(localStorage.getItem("admin_token"));
    const [page, setPage] = useState("home");
    const pages = {
        'app': (
            <div className="w-full h-full flex justify-center items-center gap-5">
                <CreateApp di={di} adminToken={adminToken} />
            </div>
        ),
        'channel_group': (
            <div className="w-full h-full flex justify-center items-center gap-5">
                <ChannelGroup di={di} adminToken={adminToken} />
            </div>
        ),
        'channel': (
            <div className="w-full h-full flex justify-center items-center gap-5">
                <Channel di={di} adminToken={adminToken} />
            </div>
        ),
        "home": (
            <div className="w-full h-full flex flex-col bg-[url(/unicon.gif)] justify-center items-center gap-5 ">
                <img src="loader.gif" className="w-128 square"/>
            </div>
        )
    }
    return (
        <div className="w-full h-full bg-linear-to-br from-purple-800 to-purple-950 flex flex-col justify-start items-start gap-5 p-5">
            <div className="flex gap-5 w-full items-center justify-between">
                <Button className="flex items-center h-fit w-1/12 justify-center" {...THEME.ACTIVE} onClick={() => setPage("nav")} >
                    <IoCaretBackSharp className="text-4xl text-orange-900/75" />
                    <p>Back</p>
                </Button>
                <Input {...THEME.ACTIVE_INPUT} placeholder="Admin Token" value={adminToken} className="grow h-fit" onChange={(e) => {
                    setAdminToken(e.target.value);
                    localStorage.setItem("admin_token", e.target.value);
                }} />
            </div>
            <div className="w-full grow flex flex-col justify-center items-center gap-5">
                <Nav pages={pages} setPage={setPage} />
                {pages[page]} 
            </div>
        </div>
    );
};
export default Main;