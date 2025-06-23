/* eslint-disable react/prop-types */

import { Button, Card, Input, TextArea } from "pixel-retroui";
import { THEME } from "./Theme";
import { useEffect, useState } from "react";
import { MdOutlineFlipCameraAndroid } from "react-icons/md";
import Form from "@components/Form";

function AddStaff({ di }) {
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
            <p className="text-2xl font-bold">Add a new Staff</p>
            <Form submitText="Create" fields={{
                name: {
                    type: "text",
                    placeholder: "Name"
                },
                email: {
                    type: "text",
                    placeholder: "Email"
                }
            }} />
            <Card {...THEME.ACTIVE} className="grid grid-cols-2 gap-2 justify-center items-center">
                <p className="text-2xl font-bold col-span-2">Permissions</p>
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

function StaffList({ di }) {
    const [staff, setStaff] = useState([]);
    useEffect(() => {
        di.request.get({
            url: di.api.get("staff-all"), callback: (response) => {
                setStaff(response.data);
            }
        });
    }, [])
    return (
        <div className="flex flex-col gap-2 justify-center items-center w-full">
            <p className="text-2xl font-bold">Staff List</p>
            <Card {...THEME.SECONDARY} className="flex flex-col gap-2 justify-center items-center grow">
                {
                    staff && staff.map((one, i) => {
                        return (
                            <Button {...THEME.ACTIVE} key={i} className="flex flex-col gap-2 justify-center items-center">
                                <p>{one.name}</p>
                                <p>{one.email}</p>
                            </Button>
                        )
                    })
                }
            </Card>
        </div>
    )
}

const Main = ({ di }) => {
    return (
        <div className="flex gap-2 justify-center items-center h-full w-full bg-linear-to-br from-red-400 to-yellow-400">
            <AddStaff di={di} />
            <StaffList di={di} />
        </div>
    );

};
export default Main;