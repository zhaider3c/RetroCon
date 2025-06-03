import { Button, Card, Input } from "pixel-retroui"
import React from "react";
import { THEME } from "@pages/Theme";
import Scroll from "@components/Scroll.jsx";

/**
 * 
 * @param Object fields - {input_type} 
 * @returns 
 */
export default function Form({ di, onSubmit, fields, submitText = "Submit", className }) {
    return (
        <Scroll className={"flex flex-col gap-2 justify-center items-end" + ` ${className}`}>
            {
                Object.keys(fields).map((x, y) => {
                    return (
                        <Card {...THEME.WHITE} key={y} className="flex flex-col justify-center items-start gap-0 bg-white" style={{width:'100%'}}>
                            <label>{x}</label>
                            <Input {...fields[x]} className="border-none" />
                        </Card>
                    )
                })
            }
            <Button onClick={onSubmit} className="w-fit">{submitText}</Button>
        </Scroll>
    )
}