/* eslint-disable react/prop-types */

import { Button, Card, Input, TextArea } from "pixel-retroui";
import { THEME } from "../Theme";
import { useEffect, useState } from "react";
import Form from "@components/Form";

function AddRole({ di }) {
    const [menu, setMenu] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState([]);
    
    useEffect(() => {
        di.request.get({
            url: di.api.get('menu'), callback: (response) => {
                setMenu(response.data);
            }
        });
    }, [])
    
    return (
        <div className="flex flex-col gap-2 justify-center items-center w-full">
            <p className="text-2xl font-bold">Add a new Role</p>
            <Form submitText="Create Role" fields={{
                name: {
                    type: "text",
                    placeholder: "Role Name"
                },
                description: {
                    type: "text",
                    placeholder: "Role Description"
                }
            }} />
            <Card {...THEME.ACTIVE} className="grid grid-cols-2 gap-2 justify-center items-center">
                <p className="text-2xl font-bold col-span-2">Role Permissions</p>
                {
                    menu && menu.map((one, i) => {
                        if (one.resources.length > 0) {
                            return (
                                <Button data-code={one.code} {...(selectedMenu.includes(one.code) ? THEME.SUCCESS : THEME.SECONDARY)}
                                    key={i} className="flex gap-2 justify-between items-center"
                                    onClick={(e) => {
                                        let buttonCode = e.target.dataset.code;
                                        if (selectedMenu.includes(buttonCode)) {
                                            setSelectedMenu(selectedMenu.filter(_code => _code !== buttonCode))
                                        } else {
                                            setSelectedMenu([...selectedMenu, buttonCode])
                                        }
                                    }}
                                >
                                    <p>{one.name}</p>
                                    <p>{one.resources.length}</p>
                                </Button>
                            )
                        }
                    })
                }
            </Card>
        </div>
    )
}

function RoleList({ di }) {
    const [roles, setRoles] = useState([]);
    
    useEffect(() => {
        di.request.get({
            url: di.api.get("roles-all"), callback: (response) => {
                setRoles(response.data);
            }
        });
    }, [])
    
    return (
        <div className="flex flex-col gap-2 justify-center items-center w-full">
            <p className="text-2xl font-bold">Role List</p>
            <Card {...THEME.SECONDARY} className="flex flex-col gap-2 justify-center items-center grow">
                {
                    roles && roles.length > 0 ? roles.map((one, i) => {
                        return (
                            <Button {...THEME.ACTIVE} key={i} className="flex flex-col gap-2 justify-center items-center">
                                <p className="font-bold">{one.name}</p>
                                <p className="text-sm">{one.description}</p>
                            </Button>
                        )
                    }) : (
                        <div className="text-center p-8">
                            <p className="text-gray-500">No roles found</p>
                            <p className="text-sm text-gray-400">Create your first role to get started</p>
                        </div>
                    )
                }
            </Card>
        </div>
    )
}

const Main = ({ di }) => {
    return (
        <div className="flex gap-2 justify-center items-center h-full w-full">
            <AddRole di={di} />
            <RoleList di={di} />
        </div>
    );
};

export default Main;
