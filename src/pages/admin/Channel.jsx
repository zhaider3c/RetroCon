/* eslint-disable react/prop-types */

import { Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Input, Popup, TextArea } from "pixel-retroui";
import Scroll from "@components/Scroll";
import { THEME } from "@pages/Theme";
import { useEffect, useState } from "react";
import Json from "@components/Json";


const Main = ({ di, adminToken }) => {
    function createApp(data) {
        di.request.post({
            url: di.api.get('channel-group'), body: JSON.stringify(data), headers: {
                "Authorization": "Bearer " + adminToken,
                "Business": null,
                "Content-Type": "application/json"
            }
        });
    }

    const [apps, setApps] = useState([]);
    const [data, setData] = useState({});
    const [channels, setChannels] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [channelIndex, setChannelIndex] = useState(null);

    useEffect(() => {
        di.request.get({
            url: di.api.get('channel'), headers: {
                "Authorization": "Bearer " + adminToken,
                "Business": null,
                "Content-Type": "application/json"
            }, callback: (res) => {
                setApps(res.data);
            }
        });
    }, []);
    useEffect(() => {
        di.request.get({
            url: di.api.get('channel'), headers: {
                "Authorization": "Bearer " + adminToken,
                "Business": null,
                "Content-Type": "application/json"
            }, callback: (res) => {
                setChannels(res.data);
            }
        });
    }, []);
    return (
        <div className="w-full h-full flex justify-center items-center gap-5">
            <Popup isOpen={isPopupOpen} {...THEME.GRAY} onClose={() => setIsPopupOpen(false)}>
                <div className="h-[50rem]">
                    <Scroll>
                        <Json data={apps[channelIndex]} />
                    </Scroll>
                </div>
            </Popup>
            <Card className="flex gap-5 flex-col">
                <p className="text-4xl text-start">Channels</p>
                {apps && apps.map((e, i) => {
                    return (
                        <Card key={i} className="flex gap-5 p-5" {...THEME.SECONDARY} onClick={(e) => {
                            setIsPopupOpen(true);
                            setChannelIndex(i);
                        }}>
                            <span>{e.name}</span>
                        </Card>
                    )
                })}
            </Card>
            <div className="flex flex-col gap-5 justify-center items-center p-5">
                <p className="text-purple-200 text-6xl text-center">Create Channel</p>
                <div className="w-full flex flex-col gap-5 justify-start items-center">
                    <label htmlFor="name" className="block text-xl font-medium text-start w-full text-purple-200">Name</label>
                    <Input {...THEME.ACTIVE_INPUT} autoComplete="off" id="name" placeholder="Zed Industries" className="w-full col-span-3" onChange={(e) => setData({ ...data, name: e.target.value })} />
                </div>
                <div className="flex flex-col gap-5 justify-start items-center w-full">
                    <label htmlFor="channel" className="block text-xl font-medium text-start w-full text-purple-200">Channels</label>
                    <div className="w-full gap-3 grid grid-cols-3">
                        {channels.map((e, i) => {
                            return (
                                <div key={i} className={`w-full flex items-center gap-2`}>
                                    <Button className="w-full" data-id={e.id} onClick={(event) => {
                                        let channels = [];
                                        let id = event.currentTarget.getAttribute("data-id");
                                        if ((data.channel_id ?? []).includes(id)) {
                                            channels = (data.channel_id ?? []).filter((x) => x != id);
                                        } else {
                                            channels = [id, ...data.channel_id ?? []];
                                        }
                                        setData({ ...data, channel_id: channels });
                                    }} bg={((data.channel_id ?? []).includes(e.id)) ? "#4ade80" : THEME.ACTIVE.bg} >
                                        {e.name}
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="w-full flex w-full gap-5 justify-end items-center">
                    <Button className="px-5 py-3" onClick={() => createApp(data)}>Create</Button>
                </div>
            </div>
        </div>
    );
};
export default Main;