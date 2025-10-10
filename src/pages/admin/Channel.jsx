/* eslint-disable react/prop-types */

import { Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Input, Popup, TextArea } from "pixel-retroui";
import Scroll from "@components/Scroll";
import { THEME } from "@pages/Theme";
import { useEffect, useState } from "react";
import Json from "@components/Json";
import Form from "@components/Form";
import { candyWrapperTheme, githubDarkTheme, JsonEditor, monoDarkTheme, psychedelicTheme } from "json-edit-react";


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
    const [data, setData] = useState("");
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

    function saveChannel(data) {
        let method = "post";
        if (data._id) {
            method = "patch";
        }
        data.id = data._id.$oid;
        di.request[method]({
            url: di.api.get('channel'), body: data, headers: {
                "Authorization": "Bearer " + adminToken,
                "Business": null,
                "Content-Type": "application/json"
            }
        });
    }

    return (
        <div className=" p-5 w-full h-full flex justify-center items-start gap-5">
            <Popup isOpen={isPopupOpen} {...THEME.GRAY} onClose={() => setIsPopupOpen(false)}>
                <div className="h-[50rem]">
                    <Scroll>
                        <Json data={apps[channelIndex]} />
                    </Scroll>
                </div>
            </Popup>
            <Card className="flex gap-5 flex-col" {...THEME.ACTIVE}>
                <p className="text-4xl text-start">Channels</p>
                {apps && apps.map((e, i) => {
                    return (
                        <Card key={i} className="flex gap-5 p-5" {...THEME.SECONDARY} onClick={(e) => {
                            // setIsPopupOpen(true);
                            setChannelIndex(i);
                            setData(JSON.stringify(channels[i], null, 2));
                        }}>
                            <span>{e.name}</span>
                        </Card>
                    )
                })}
            </Card>
            <div className="flex flex-col gap-5 justify-center items-start grow h-196">
                <Scroll className="grow w-full">
                    {data && <JsonEditor
                        className="w-full"
                        data={JSON.parse(data ?? "{}")}
                        setData={(data) => setData(JSON.stringify(data, null, 2))}
                        theme={[
                            githubDarkTheme,
                            {
                                input: ["white"]
                            }
                        ]}
                        minWidth={"90%"}
                        rootName=""
                    />}
                </Scroll>
                <Button {...THEME.SUCCESS} className="min-w-16"
                    onClick={() => saveChannel(JSON.parse(data ?? "{}"))}>{data && data.includes("_id") ? "Update" : "Save"}</Button>
            </div>
        </div>
    );
};
export default Main;