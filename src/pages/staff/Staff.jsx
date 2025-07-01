/* eslint-disable react/prop-types */

import { Button, Card, Input, TextArea } from "pixel-retroui";
import { THEME } from "@pages/Theme";
import { useEffect, useState } from "react";
import Form from "@components/Form";
import Scroll from "@components/Scroll";

function AddStaff({ di }) {
    const [menu, setMenu] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState([]);
    const [formData, setFormData] = useState({});
    
    useEffect(() => {
        di.request.get({
            url: di.api.get('menu'), callback: (response) => {
                setMenu(response.data);
            }
        });
    }, [])
    
    return (
        <Card {...THEME.SECONDARY} className="flex flex-col gap-2 justify-center items-center h-fit">
            <div className="flex gap-2 justify-center items-center w-full grow">
                <div className="grow flex flex-col gap-5 justify-start items-center p-5">
                    <p className="text-2xl font-bold grow">Add a new Staff</p>
                    <Form di={di} className="" submitText="Create" data={formData} onChange={(data) => {
                        setFormData(data);
                        console.log(data);
                        console.log(formData);
                    }} fields={{
                        name: {
                            type: "text",
                            placeholder: "Name"
                        },
                        email: {
                            type: "text",
                            placeholder: "Email"
                        }
                    }}
                        onSubmit={(data, di) => {
                            if (selectedMenu.length < 1) {
                                di.toast.error("No permission selected");
                                return;
                            }
                            di.request.post({
                                url: di.api.post("staff"),
                                data: { ...data, menu: selectedMenu },
                                callback: (response) => {
                                    di.toast.success("Staff created successfully");
                                }
                            });
                        }}
                    />
                </div>
                <Card {...THEME.ACTIVE} className="w-fit p-5 h-96">
                    <Scroll className="w-full h-full">
                        <div className="grid grid-cols-4 gap-2 justify-center items-center ">
                            <p className="text-2xl font-bold col-span-4">Permissions</p>
                            {
                                menu && menu.map((one, i) => {
                                    if (one.resources.length > 0) {
                                        return (
                                            <Button data-code={one.code} {...(selectedMenu.includes(one.code) ? THEME.SUCCESS : THEME.SECONDARY)}
                                                key={i} className="flex justify-between items-center text-center h-12 "
                                                onClick={(e) => {
                                                    let buttonCode = e.target.dataset.code;
                                                    if (selectedMenu.includes(buttonCode)) {
                                                        setSelectedMenu(selectedMenu.filter(_code => _code !== buttonCode))
                                                    } else {
                                                        setSelectedMenu([...selectedMenu, buttonCode])
                                                    }
                                                }}
                                            >
                                                {one.name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                            </Button>
                                        )
                                    }
                                })
                            }
                        </div>
                    </Scroll>
                </Card>
            </div>
        </Card>
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
        <div className="flex flex-col gap-2 justify-start items-center h-full w-full">
            <AddStaff di={di} />
            <StaffList di={di} />
        </div>
    );

};
export default Main;