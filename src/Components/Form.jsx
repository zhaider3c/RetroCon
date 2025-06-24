import { Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, Input, DropdownMenuItem, TextArea } from "pixel-retroui"
import React, { useState } from "react";
import { THEME } from "@pages/Theme";
import Scroll from "@components/Scroll.jsx";

/**
 * 
 * @param Object fields - {input_type} 
 * @returns 
 */
export default function Form({ di, onSubmit, fields, submitText = "Submit", className, theme }) {
    const [data, setData] = useState({});

    // Initialize data state with field names
    React.useEffect(() => {
        const initialData = {};
        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            if (field.type === 'select' && field.options && field.options.length > 0) {
                initialData[fieldName] = field.options[0].value;
            } else {
                initialData[fieldName] = '';
            }
        });
        setData(initialData);
    }, [fields]);

    const handleInputChange = (fieldName, value) => {
        setData(prevData => ({
            ...prevData,
            [fieldName]: value
        }));
    };

    const handleSelectChange = (fieldName, value) => {
        setData(prevData => ({
            ...prevData,
            [fieldName]: value
        }));
    };

    function initiateSubmit() {
        onSubmit(data);
    }

    return (
        <Scroll className={"flex flex-col gap-2 justify-center items-center w-full" + ` ${className}`}>
            {
                Object.keys(fields).map((x, y) => {
                    const field = fields[x];
                    return (
                        <div className="flex justify-between items-center w-full">
                            <Card {...THEME.ACTIVE_INPUT} key={y} className="flex flex-col justify-center w-full items-start gap-3">
                                <label className="text-sm font-bold rounded-xl w-full">{fields[x].label}</label>
                                {field.type === 'select' ? (
                                    <DropdownMenu {...THEME.ACTIVE} className="p-3 w-full">
                                        <DropdownMenuTrigger className="w-full">
                                            {data[x] || 'Select...'}
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="flex gap-3">
                                            {field.options.map((option, index) => (
                                                <DropdownMenuItem>
                                                    <Button
                                                        key={index}
                                                        {...THEME.ACTIVE_INPUT}
                                                        onClick={() => handleSelectChange(x, option.value)}
                                                    >
                                                        {option.label}
                                                    </Button>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : field.type === 'textarea' ? (
                                    <TextArea
                                        {...THEME.ACTIVE_INPUT}
                                        {...field}
                                        onChange={(e) => handleInputChange(x, e.target.value)}
                                    />
                                ) : (
                                    <Input
                                        {...THEME.ACTIVE_INPUT}
                                        {...field}
                                        onChange={(e) => handleInputChange(x, e.target.value)}
                                    />
                                )}
                            </Card>
                        </div>
                    )
                })
            }
            <div className="flex justify-between w-full p-0">
                <Button onClick={initiateSubmit} {...THEME.ACTIVE_BUTTON} className="grow m-0">{submitText}</Button>
            </div>
        </Scroll>
    )
}