/* eslint-disable react/prop-types */

import { Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Input, TextArea } from "pixel-retroui";
import { THEME } from "@pages/Theme";
import { useEffect, useState } from "react";
import ReactJson from "@microlink/react-json-view";
import Scroll from "@components/Scroll";
import Form from "@components/Form";

const Config = ({ di }) => {
    function Create({ di }) {
        return (
            <Card className="flex flex-col gap-5 w-1/2" {...THEME.SECONDARY}>
                <p className="text-2xl">Create Config</p>
                <div>
                    <Form fields={{
                        "key": {
                            label: "Key",
                            type: "text",
                            placeholder: "config_key"
                        },
                        'type': {
                            label: "Type",
                            type: "select",
                            options: [
                                { value: "business_id", label: "Business" },
                                { value: "account_id", label: "Account" },
                                { value: "global", label: "Global" }
                            ]
                        },
                        "value": {
                            label: "Value",
                            type: "textarea",
                            placeholder: "This is the value of the config"
                        }
                    }} onSubmit={(data) => {
                        data.value = data.value.trim();
                        if (isNaN(data.value)) {
                            if (data.value.toLowerCase() === "true") {
                                data.value = true;
                            } else if (data.value.toLowerCase() === "false") {
                                data.value = false;
                            }
                        } else {
                            data.value = parseFloat(data.value);
                        }
                        di.request.post({
                            url: di.api.get('config'),
                            body: data,
                            callback: (data) => {
                                console.log(data);
                            }
                        });

                    }} submitText="Save" />
                </div>
            </Card>
        );
    }

    function Read({ di }) {
        const [key, setKey] = useState("");
        const [data, setData] = useState({});

        return (
            <Card className="flex flex-col gap-5 w-1/2 p-5!" {...THEME.SECONDARY}>
                <p className="text-2xl">Read Config</p>
                <div className="flex gap-5">
                    <Input
                        className="grow"
                        placeholder="config_key"
                        value={key}
                        onChange={(e) => setKey(e.target.value.trim())}
                        {...THEME.ACTIVE_INPUT} />
                    <Button
                        className="min-w-24"
                        onClick={() => {
                            di.request.get({
                                url: di.api.get('config') + `?key=${key}`,
                                callback: (data) => {
                                    setData(data);
                                }, error_callback: (error) => {
                                    setData(error.message);
                                }
                            });
                        }}>Read</Button>
                </div>
                <TextArea {...THEME.ACTIVE_INPUT} value={typeof data === "object" ? JSON.stringify(data, null, 2) : data} rows={10}>
                </TextArea>
            </Card>
        );
    }

    return (
        <div className="flex gap-5 p-5 grow h-full justify-center items-center">
            <Create di={di} />
            <Read di={di} />
        </div>
    );
}
export default Config;