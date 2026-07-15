/* eslint-disable react/prop-types */

import { useState } from "react";
import CreateApp from "@pages/admin/CreateApp";
import ChannelGroup from "@pages/admin/ChannelGroup";
import Channel from "@pages/admin/Channel";
import Users from "@pages/admin/Users";
import BG from "@assets/admin.gif";
import Ai from "@pages/admin/Ai";
import PageSidebar from "@components/PageSidebar";

const Nav = ({ pages, setPage, page }) => {
    const sections = [{
        items: Object.keys(pages).map((x) => ({
            key: x,
            label: (
                <p className={`${x.length > 5 ? "marquee" : ""} whitespace-nowrap`}>
                    {x.toLocaleUpperCase().replace('_', " ")}
                </p>
            ),
            active: page === x,
            onClick: () => setPage(x),
            className: "h-10 text-xs overflow-hidden",
        })),
    }];
    return <PageSidebar theme="glass" glassClassName="bg-white/20" sections={sections} />;
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
        ),
        "ai": (
            <div className="w-full h-full flex justify-center items-center gap-5">
                <Ai di={di} adminToken={token} />
            </div>
        )
    }
    return (
        <div className="w-full h-full bg-linear-to-br from-purple-800 to-purple-950 flex flex-col justify-start items-start gap-5 bg-cover bg-center"
            style={{ backgroundImage: `url(${BG})` }}>
            <div className="w-full grow flex justify-center items-center gap-5">
                <Nav pages={pages} setPage={setPage} page={page} />
                <div className="grow flex flex-col justify-center items-center gap-5 p-3">
                    <div className="w-full">
                        {pages[page]}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Main;