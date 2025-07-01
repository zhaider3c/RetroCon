/* eslint-disable react/prop-types */

import { Button, Card, Input, TextArea } from "pixel-retroui";
import { THEME } from "@pages/Theme";
import { useEffect, useState } from "react";

export default function Auth({ di }) {
    const [url, setUrl] = useState(null);
    useEffect(() => {
        di.request.get({ url: di.api.get('jira-auth-url'), callback: (data) => { setUrl(data.data) } })
    }, []);
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <Card {...THEME.SECONDARY} className="flex flex-col items-end justify-center gap-2">
                <p className="text-2xl font-bold w-full text-start">Jira oAuth</p>
                <p className="text-sm text-gray-600">
                    Connect your Jira account securely through OAuth 2.0 authentication.
                    <br />
                    This will allow the application to access your Jira projects and issues 
                    on your behalf.
                    <br />
                    Click the button below to begin the authorization process.
                </p>
                <Button {...THEME.ACTIVE} className="px-8 py-3 text-lg"
                    onClick={() => {
                        window.location.href = url;
                    }}
                >
                    <a href={url} className="w-full h-full">Perform oAuth</a>
                </Button>
            </Card>
        </div>
    )
}