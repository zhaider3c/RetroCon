/* eslint-disable react/prop-types */

import { Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Input, TextArea } from "pixel-retroui";
import { THEME } from "@pages/Theme";
import { useEffect, useState } from "react";
import BG from '@assets/SSO.gif';
import Client from '@pages/sso/Client';
import Scopes from '@pages/sso/Scopes';

export const Main = ({ di }) => {

    const pages = {
        'Clients': <Client di={di} />,
        'Scopes': <Scopes di={di} />
    }
    const [activePage, setActivePage] = useState('Clients');
    return (
        <div className="overflow-hidden w-full h-full flex justify-center items-start gap-5" style={{ backgroundImage: `url(${BG})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <Card className="h-full flex flex-col justify-start items-center gap-5" {...THEME.ACTIVE}>
                <p className="text-2xl w-full">SSO</p>
                {Object.keys(pages).map((page, index) => (
                    <Button key={index} onClick={() => setActivePage(page)} className="w-full" {...(activePage === page ? THEME.SUCCESS : THEME.SECONDARY)}>
                        {page.toUpperCase()}
                    </Button>
                ))}
            </Card>
            <Card className="h-full flex flex-col justify-center grow items-center gap-5" {...THEME.TRANSPARENT}>
                {pages[activePage]}
            </Card>
        </div>
    );
};