/* eslint-disable react/prop-types */

import { Button, Card, Input, TextArea } from "pixel-retroui";
import { THEME } from "./Theme";
import { useState } from "react";
import CreateApp from "@pages/admin/CreateApp";
import ChannelGroup from "@pages/admin/ChannelGroup";
import Channel from "@pages/admin/Channel";
import Users from "@pages/admin/Users";
import BG from "@assets/admin.gif";

const Nav = ({ pages, setPage, page }) => {
    return (
        (
            <div className="flex flex-col gap-3 justify-start items-between h-full overflow-hidden bg-white/25 border-e-2! border-cyan-800! p-5 backdrop-blur-md!">
                {
                    Object.keys(pages).map((x, i) => {
                        return (
                            <Button
                                key={x}
                                onClick={() => setPage(x)}
                                className="col-span-1 p-0 h-8 text-xs overflow-hidden"
                                {...(page === x ? THEME.SUCCESS : THEME.SECONDARY)}
                            >
                                <p className={`${x.length > 5 ? "marquee" : ""} whitespace-nowrap`}>
                                    {x.toLocaleUpperCase().replace('_', " ")}
                                </p>
                            </Button>
                        )
                    })
                }
            </div>
        )
    )
}

const Main = ({ di }) => {
    const [adminToken, setAdminToken] = useState(localStorage.getItem("admin_token") ?? null);
    let token = adminToken ?? localStorage.getItem("token");
    const [page, setPage] = useState("home");
    const pages = {
        'app': (
            <div className="w-full h-full flex justify-center items-center gap-5">
                <CreateApp di={di} adminToken={token} />
            </div>
        ),
        'channel_group': (
            <div className="w-full h-full flex justify-center items-center gap-5">
                <ChannelGroup di={di} adminToken={token} />
            </div>
        ),
        'channel': (
            <div className="w-full h-full flex justify-center items-center gap-5">
                <Channel di={di} adminToken={token} />
            </div>
        ),
        "home": (
            <div className="w-full h-full flex flex-col justify-start items-end gap-5 ">
                <p className="text-4xl text-white/50 bg-purple-900 rounded-xl px-5 py-3"> Admin Panel</p>
            </div>
        ),
        "users": (
            <div className="w-full h-full flex justify-center items-center gap-5">
                <Users di={di} token={token} />
            </div>
        )
    }
    return (
        <div className="w-full h-full bg-linear-to-br from-purple-800 to-purple-950 flex flex-col justify-start items-start gap-5 bg-cover bg-center"
            style={{ backgroundImage: `url(${BG})` }}>
            <div className="w-full grow flex justify-center items-center gap-5">
                <Nav pages={pages} setPage={setPage} page={page} />
                <div className="w-full flex justify-center grow items-center">
                    <Card {...THEME.SECONDARY} className="w-full">
                        {pages[page]}
                    </Card>
                </div>
            </div>
        </div>
    );
};
export default Main;