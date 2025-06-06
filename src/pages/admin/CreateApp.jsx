/* eslint-disable react/prop-types */

import { Button, Card, Input, TextArea } from "pixel-retroui";
import { THEME } from "@pages/Theme";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";



const Main = ({ di,adminToken }) => {
    function createApp(data) {
        di.request.post({
            url: di.api.get('app'), body: JSON.stringify(data),headers:{
                "Authorization": "Bearer " + adminToken,
                "Business": null,
                "Content-Type": "application/json"
            }
        });
    }

    const [apps, setApps] = useState([]);
    const [data,setData] = useState({});
    useEffect(() => {
        di.request.get({
            url: di.api.get('app'), callback: (res) => {
                setApps(res.data);
            }
        });
    }, []);
    return (
        <div className="w-full h-full flex justify-center items-center gap-5">
            <Card className="flex gap-5 flex-col">
                <p className="text-4xl text-start">Apps</p>
                {apps.map((e, i) => {
                    return (
                        <Card key={i} className="flex flex-col gap-5 p-5" {...THEME.MUDDY}>
                            <p className="text-2xl">{e.name}</p>
                            <p className="text-xl">{e.code}</p>
                            <p className="text-xl">{e.url.substring(0, 35)}</p>
                            <p className="text-xl">{e.marketplace}</p>
                        </Card>
                    )
                })}
            </Card>
            <div className="flex flex-col gap-5 justify-center items-center">
                <p className="text-purple-200 text-6xl text-center">Create App</p>
                <div className="w-full grid grid-cols-4 gap-5 justify-center items-center">
                    <label htmlFor="name" className="block text-sm font-medium text-end text-purple-200">Name</label>
                    <Input {...THEME.ACTIVE_INPUT} id="name" placeholder="Zed Industries" className="w-full col-span-3" onChange={(e) => setData({ ...data, name: e.target.value })} />
                </div>
                <div className="w-full grid grid-cols-4 gap-5 justify-center items-center">
                    <label htmlFor="code" className="block text-sm font-medium text-end text-purple-200">Code</label>
                    <Input {...THEME.ACTIVE_INPUT} id="code" placeholder="zed_ind" className="w-full col-span-3" onChange={(e) => setData({ ...data, code: e.target.value })} />
                </div>
                <div className="w-full grid grid-cols-4 gap-5 justify-center items-center">
                    <label htmlFor="url" className="block text-sm font-medium text-end text-purple-200">Url</label>
                    <Input {...THEME.ACTIVE_INPUT} id="url" placeholder="zed.com/api" className="w-full col-span-3" onChange={(e) => setData({ ...data, url: e.target.value })} />
                </div>
                <div className="w-full grid grid-cols-4 gap-5 justify-center items-center">
                    <label htmlFor="marketplace" className="block text-sm font-medium text-end text-purple-200">Marketplace</label>
                    <Input {...THEME.ACTIVE_INPUT} id="marketplace" placeholder="Kululu" className="w-full col-span-3" onChange={(e) => setData({ ...data, marketplace: e.target.value })} />
                </div>
                <div className="flex w-full gap-5 justify-end items-end">
                    <Button className="px-5 py-3 col-span-1" onClick={() => createApp(data)}>Create</Button>
                </div>
            </div>
        </div>
    );
};
export default Main;