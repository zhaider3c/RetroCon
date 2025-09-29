/* eslint-disable react/prop-types */

import { Button, Card, Input, TextArea } from "pixel-retroui";
import { THEME } from "@pages/Theme";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";



const Main = ({ di, adminToken }) => {
    function createApp(data) {
        di.request.post({
            url: di.api.get('app'), body: JSON.stringify(data), headers: {
                "Authorization": "Bearer " + adminToken,
                "Business": null,
                "Content-Type": "application/json"
            }
        });
    }

    const [apps, setApps] = useState([]);
    const [data, setData] = useState({});
    useEffect(() => {
        di.request.get({
            url: di.api.get('app'), callback: (res) => {
                setApps(res.data);
            }
        });
    }, []);
    return (
        <div className="w-full h-full flex justify-center items-start gap-5 p-5">
            <div className="flex w-full gap-5 flex-col">
                <p className="text-4xl text-start">Apps</p>
                {apps && apps.map((e, i) => {
                    return (
                        <Card key={i} className="flex gap-5 p-5" {...THEME.ACTIVE}>
                            <div className="flex flex-col">
                                <span className="text-purple-200 text-sm">
                                    Name
                                </span>
                                <span className="text-xl">
                                    {e.name}
                                </span>
                            </div>
                            <div className="text-xl flex flex-col">
                                <span className="text-purple-200 text-sm">
                                    Code
                                </span>
                                <span>
                                    {e.code}
                                </span>
                            </div>
                            <div className="text-xl flex flex-col">
                                <span className="text-purple-200 text-sm">
                                    Marketplace
                                </span>
                                <span>
                                    {e.marketplace}
                                </span>
                            </div>
                        </Card>
                    )
                })}
            </div>
            <div className="flex flex-col w-full gap-5 justify-center items-center">
                <p className="text-purple-200 text-xl text-start w-full">Create new app</p>
                <TextArea {...THEME.ACTIVE_INPUT}
                    id="name" placeholder="New app json data"
                    rows={15} 
                    onChange={(e) => setData(e.target.value.trim())} />
                <div className="flex w-full gap-5 justify-end items-end">
                    <Button className="px-5 py-3 col-span-1" onClick={() => createApp(data)}>Create</Button>
                </div>
            </div>
        </div >
    );
};
export default Main;