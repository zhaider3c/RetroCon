/* eslint-disable react/prop-types */

import { Button, Card, Input, Popup, TextArea } from "pixel-retroui";
import { useEffect, useState } from "react";
import { THEME } from "@pages/Theme";
import BG from '@assets/SSO.gif';
import Scroll from "@components/Scroll";
import ReactJson from "@microlink/react-json-view";
import { FaTrashAlt } from "react-icons/fa";
import Form from "@components/Form";

function Create({ di }) {
    const [data, setData] = useState({});

    // Scope fields: ('name', 'description', 'permissions', 'status')
    const fields = {
        "name": {
            label: 'Name',
            type: 'text',
            placeholder: "read:user"
        },
        "description": {
            label: 'Description',
            type: 'text',
            placeholder: "Read user information"
        },
        "permissions": {
            label: 'Permissions',
            type: 'text',
            placeholder: "user:read,profile:read"
        },
        "status": {
            label: 'Status',
            type: 'select',
            options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
            ]
        }
    }

    return (
        <div className="flex flex-col gap-5 p-5 grow h-full">
            <div className="w-full flex justify-center items-center grow">
                <Card className="w-full flex flex-col" {...THEME.SECONDARY}>
                    <p className="text-2xl w-full">Create SSO Scope</p>
                    <div className="flex items-center justify-center w-full">
                        <div className="flex flex-col gap-4 w-full">
                            <Form fields={{
                                "code": {
                                    label: 'Code',
                                    type: 'text',
                                    placeholder: "read:user"
                                },
                                "description": {
                                    label: 'Description',
                                    type: 'text',
                                    placeholder: "Read user information"
                                }
                            }} onSubmit={(data) => {
                                di.request.post({
                                    url: di.api.get('sso-scope'),
                                    body: JSON.stringify(data),
                                    callback: (res) => {
                                        setData({ ...data, _id: res._id });
                                    }
                                });
                            }}
                                submitText="Create"
                            />
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
            url: di.api.get('sso-scope'), callback: (res) => {
                setData(res.data);
            }
        })
    }, []);
    return (
        <div className="flex justify-center items-center grow">
            <Popup {...THEME.SECONDARY} className="flex flex-col justify-center items-center gap-5" isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <p className="text-2xl border-b-2 border-black">{JSON.parse(selected)?.name?.toUpperCase()} {JSON.parse(selected)?._id?.$oid}</p>
                <Card {...THEME.ACTIVE} className="w-full h-128 flex flex-col justify-center items-start gap-5">
                    <Scroll className="grow">
                        <ReactJson src={JSON.parse(selected)} theme="greenscreen" />
                    </Scroll>
                </Card>
            </Popup>
            <Card className="w-full flex flex-col" {...THEME.SECONDARY}>
                <p className="text-2xl w-full">SSO Scopes</p>
                <div className="flex flex-col gap-2">
                    {data && data.map((item, i) => (
                        <Card {...THEME.ACTIVE} key={i} className="flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-2">
                                    <p className="text-2xl">{item.code}</p>
                                    <p className="text-sm">{item.description}</p>
                                </div>
                                <Button
                                    {...THEME.TRANSPARENT}
                                    onClick={() => {
                                        di.request.delete({
                                            url: `${di.api.get('sso-scope')}?code=${item.code}`,
                                            callback: (res) => {
                                                setData(data.filter((_, index) => index !== i));
                                            }
                                        });
                                    }}
                                >
                                    <FaTrashAlt className="text-2xl text-red-500" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </Card>
        </div>
    )
}

function Permit({ di }) {
    return (
        <div className="flex flex-col gap-5 p-5 grow h-full justify-start items-center">
            <Card className="w-full flex flex-col" {...THEME.SECONDARY}>
                <p className="text-2xl w-full">Scope Permission</p>
                <Form fields={{
                    "scope": {
                        label: 'Scope code',
                        type: 'text',
                        placeholder: "read:user"
                    },
                    "endpoint": {
                        label: 'Endpoint',
                        type: 'text',
                        placeholder: "v2/user/login"
                    },
                    "verb": {
                        label: 'Method',
                        type: 'select',
                        options: [
                            { value: 'GET', label: 'GET' },
                            { value: 'POST', label: 'POST' },
                            { value: 'PUT', label: 'PUT' },
                            { value: 'DELETE', label: 'DELETE' },
                            { value: 'PATCH', label: 'PATCH' },
                        ]
                    }
                }} onSubmit={(data) => {
                    di.request.post({
                        url: di.api.get('sso-scope-permit'),
                        body: JSON.stringify(data),
                    });
                }} submitText="Permit" />
            </Card>
        </div>
    )
}

export default function Main({ di }) {
    return (
        <div style={{ backgroundImage: `url(${BG})` }} className="w-full h-full bg-fill bg-bottom bg-no-repeat flex flex-col gap-5 p-5">
            <Card className="w-fit text-2xl" {...THEME.ACTIVE}>
                SSO Scopes
            </Card>
            <div className="flex gap-5 grow">
                <Create di={di} />
                <List di={di} />
                <Permit di={di} />
            </div>
        </div>
    )
}

