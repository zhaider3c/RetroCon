/* eslint-disable react/prop-types */

import { Button, Card, Input, Popup, TextArea } from "pixel-retroui";
import { useEffect, useState } from "react";
import { THEME } from "@pages/Theme";
import BG from '@assets/SSO.gif';
import Scroll from "@components/Scroll";
import ReactJson from "@microlink/react-json-view";

function Create({ di }) {
    const [data, setData] = useState({});

    // ('apps', 'name', 'scopes', 'status', 'redirect_uri')]
    const fields = {
        "name": {
            label: 'Name',
            type: 'text',
            placeholder: "PikPok App"
        },
        "apps": {
            label: 'Apps',
            type: 'text',
            placeholder: "PikPok App"
        },
        "scopes": {
            label: 'Scopes',
            type: 'text',
            placeholder: "read,write,delete"
        },
        "status": {
            label: 'Status',
            type: 'select',
            options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
            ]
        },
        "redirect_uri": {
            label: 'Redirect URI',
            type: 'text',
            placeholder: "https://example.com/callback"
        }
    }


    return (
        <div className="flex flex-col gap-5 p-5 grow h-full">
            <div className="w-full flex justify-center items-center grow">
                <Card className="w-full flex flex-col" {...THEME.SECONDARY}>
                    <p className="text-2xl w-full">Create SSO Client</p>
                    <div className="flex items-center justify-center w-full">
                        <div className="flex flex-col gap-4 w-full">
                            <TextArea
                                {...THEME.ACTIVE_INPUT}
                                placeholder={`Enter JSON data here...
Example:
{
  "name": "PikPok App",
  "apps": "PikPok App", 
  "scopes": "read,write,delete",
  "status": "active",
  "redirect_uri": "https://example.com/callback"
}`}
                                className="h-64"
                                onChange={(e) => {
                                    try {
                                        const jsonData = JSON.parse(e.target.value);
                                        setData(jsonData);
                                    } catch (error) {
                                        console.error('Invalid JSON:', error);
                                    }
                                }}
                            />
                            <Button
                                {...THEME.ACTIVE_BUTTON}
                                onClick={() => {
                                    try {
                                        di.request.post({
                                            url: di.api.get('sso-client'),
                                            body: JSON.stringify(data),
                                            callback: (res) => {
                                                console.log(res);
                                            }
                                        });
                                    } catch (error) {
                                        console.error('Invalid JSON:', error);
                                    }
                                }}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

function List({ di }) {
    const [data, setData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    useEffect(() => {
        di.request.get({
            url: di.api.get('sso-client'), callback: (res) => {
                setData(res.data);
            }
        })
    }, []);
    return (
        <div className="flex justify-center items-center grow">
            <Popup {...THEME.SECONDARY} className="flex flex-col justify-center items-center gap-5" isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <p className="text-2xl border-b-2 border-black">{JSON.parse(selected)?.name.toUpperCase()} {JSON.parse(selected)?._id?.$oid}</p>
                <Card {...THEME.ACTIVE} className="w-full h-128 flex flex-col justify-center items-start gap-5">
                    <Scroll className="grow">
                        <ReactJson src={JSON.parse(selected)} theme="greenscreen" />
                    </Scroll>
                </Card>
            </Popup>
            <Card className="w-full flex flex-col" {...THEME.SECONDARY}>
                <p className="text-2xl w-full">SSO Clients</p>
                <div className="grid grid-cols-3 gap-2">
                    {data && data.map((item, i) => (
                        <Button {...THEME.ACTIVE}
                            data-data={JSON.stringify(item)} key={i}
                            className=""
                            onClick={(e) => {
                                setSelected(e.target.dataset.data);
                                setIsOpen(true);
                            }}
                        >
                            {item.name}
                        </Button>
                    ))}
                </div>
            </Card>
        </div>
    )
}

export default function Main({ di }) {
    return (
        <div style={{ backgroundImage: `url(${BG})` }} className="w-full h-full bg-fill bg-bottom bg-no-repeat flex flex-col gap-5 p-5">
            <Card className="w-fit text-2xl" {...THEME.ACTIVE}>
                Single Sign On
            </Card>
            <div className="flex gap-5 grow">
                <Create di={di} />
                <List di={di} />
            </div>
        </div>
    )
}

