/* eslint-disable react/prop-types */

import { Button, Card, Input, TextArea } from "pixel-retroui";
import { useEffect, useState } from "react";
import { THEME } from "@pages/Theme";
import Form from "@components/Form";

export function Main({ di }) {
    
    // ('apps', 'name', 'scopes', 'status', 'redirect_uri')]
    const fields = {
        "Name":{
            type:'text',
            placeholder:"PikPok App"
        },
         "apps":{
            type:'text',
            placeholder:"PikPok App"
        },
        "Scopes":{
            type:'text',
            placeholder:"read,write,delete"
        },
        "Status":{
            type:'select',
            options:[
                {value:'active', label:'Active'},
                {value:'inactive', label:'Inactive'}
            ]
        },
        "Redirect URI":{
            type:'text',
            placeholder:"https://example.com/callback"
        }
    }


    return (
        <div className="w-full h-full bg-[url('SSO.gif')] bg-fill bg-bottom bg-no-repeat flex flex-col gap-5 p-5">
            <Card className="w-fit text-2xl" {...THEME.ACTIVE}>
                Single Sign On
            </Card>
            <div className="w-full flex justify-center items-center grow">
                <Card className="w-1/2 flex flex-col" {...THEME.SECONDARY}>
                    <p className="text-2xl w-full">Create SSO Client</p>
                    <div className="flex bg-red-900 items-end justify-center">
                        <Form di={di} fields={fields} submitText="Save" className='grow bg-blue-900 w-full'/>
                    </div>
                </Card>
            </div>
        </div>
    );
}

