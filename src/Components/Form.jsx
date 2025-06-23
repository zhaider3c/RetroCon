import { Button, Card, Input } from "pixel-retroui"
import React from "react";
import { THEME } from "@pages/Theme";
import Scroll from "@components/Scroll.jsx";

/**
 * 
 * @param Object fields - {input_type} 
 * @returns 
 */
export default function Form({ di, onSubmit, fields, submitText = "Submit", className, theme }) {
    return (
        <Scroll className={"flex flex-col gap-2 justify-center items-end" + ` ${className}`}>
            {
                Object.keys(fields).map((x, y) => {
                    return (
                        <Card {...THEME.ACTIVE_INPUT} key={y} className="flex flex-col justify-center items-start gap-0" >
                            <label className="text-sm font-bold rounded-xl">{x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()}</label>
                            <Input {...THEME.ACTIVE_INPUT} {...fields[x]} className="border-none" />
                        </Card>
                    )
                })
            }
            <div className="flex justify-between w-full p-0">
                <Button onClick={onSubmit} {...THEME.ACTIVE_BUTTON} className="grow m-0">{submitText}</Button>
            </div>
        </Scroll>
    )
}