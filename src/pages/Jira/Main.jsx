/* eslint-disable react/prop-types */

import { Button, Card, Input, TextArea } from "pixel-retroui";
import { THEME } from "@pages/Theme";
import Auth from "@pages/Jira/Auth";
import User from "@pages/Jira/User";
import { useState } from "react";

export default function Main({ di }) {
    const pages = [
        {
            "code": "oauth",
            "title": "oAuth",
            "desc": "Authentication",
            "component": <Auth di={di} />
        },
        {
            "code": "user",
            "title": "Tasks",
            "desc": "Jira tasks",
            "component": <User di={di} />
        }
    ]
    const [page, setPage] = useState(pages[0]);
    return (
        <div className="h-full w-full flex bg-cover bg-center overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-48 h-full bg-black/50">
                <Card {...THEME.ACTIVE} className="p-3 flex flex-col justify-start items-center gap-2 h-full">
                    <div className="flex flex-col gap-2">
                        {pages.map((page) => {
                            return <Card {...THEME.SECONDARY} className={`rounded-lg cursor-pointer transition-colors`} onClick={() => setPage(page)}>
                                <h3 className="font-semibold">{page.title}</h3>
                                <p className="text-sm text-gray-600">{page.desc}</p>
                            </Card>
                        })}
                    </div>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col grow bg-zinc-900">
                {/* Page Content */}
                <div className="grow w-full overflow-auto p-5">
                    {page.component}
                </div>
            </div>
        </div>
    )
}