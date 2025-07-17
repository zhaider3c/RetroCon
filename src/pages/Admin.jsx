/* eslint-disable react/prop-types */

import { Button, Card, Input, TextArea } from "pixel-retroui";
import { THEME } from "./Theme";
import { useState } from "react";
import CreateApp from "@pages/admin/CreateApp";
import ChannelGroup from "@pages/admin/ChannelGroup";
import Channel from "@pages/admin/Channel";
import { IoCaretBackSharp } from "react-icons/io5";
import loader from "@assets/loader.gif";
import Users from "@pages/admin/Users";
import BG from "@assets/admin.gif";

const Nav = ({ pages, setPage, page }) => {
    return (
        (
            <div className="grow grid grid-cols-12 gap-5 justify-start items-between w-full">
                <div className="grid grid-cols-10 col-span-6 text-start">
                    {
                        Object.keys(pages).map((x, i) => {
                            return (
                                <Button key={x} onClick={() => {
                                    setPage(x);
                                }} className="col-span-2" {...(page === x ? THEME.SUCCESS : THEME.SECONDARY)}>
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
            <div className="w-full h-full flex flex-col justify-start items-end gap-5 ">
                <p className="text-4xl text-white/50 bg-purple-900 rounded-xl px-5 py-3"> Admin Panel</p>
            </div>
        ),
        "users": (
            <div className="w-full h-full flex justify-center items-center gap-5">
                <Users di={di} adminToken={adminToken} />
            </div>
        )
    }
    return (
        <div className="w-full h-full bg-linear-to-br from-purple-800 to-purple-950 flex flex-col justify-start items-start gap-5 p-5 bg-cover bg-center"
            style={{ backgroundImage: `url(${BG})` }}>
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
                <Nav pages={pages} setPage={setPage} page={page} />
                {pages[page]}
            </div>
        </div>
    );
};
export default Main;