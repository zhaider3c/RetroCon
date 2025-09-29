/* eslint-disable react/prop-types */

import { Button, Card, Input, TextArea } from "pixel-retroui";
import { THEME } from "@pages/Theme";
import { useEffect, useState } from "react";




export default function Auth({ di }) {

    const [url, setUrl] = useState(null);
    const [data, setData] = useState({});

    useEffect(() => {
        di.request.get({ url: di.api.get('jira-auth-url'), callback: (data) => { setUrl(data.data) } })
    }, []);

    useEffect(() => {
        di.request.get({
            url: di.api.get('jira-user'), callback: (data) => {
                setData(data.data);
            }
        });
    }, []);

    const User = () => {
        return (
            <Card {...THEME.SECONDARY} className="flex flex-col gap-2 justify-center">
                {(data?.message || data?.error) ? (
                    <>
                        <p className="text-2xl font-bold">{data.message ?? data.error}</p>
                        <p className="text-lg text-gray-400">{data.error_description ?? "Please check your Jira account and try again."}</p>
                    </>
                ) : (
                    <>
                        <p className="text-sm text-gray-600">{data.accountId}</p>
                        <div className="flex justify-between items-end">
                            <p className="text-xl font-bold">{data.displayName}</p>
                            <p className={"text-sm text-gray-600 " + `${data.active ? "text-green-500" : "text-red-500"}`}>{data.active ? "Active" : "Inactive"}</p>
                        </div>
                        <div className="flex gap-0 justify-between">
                            <p className="text-sm text-gray-500">{data.emailAddress}</p>
                            <p className="text-sm text-gray-600">{data.accountType}</p>
                        </div>
                    </>
                )}
            </Card>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            {data?.accountId && <User />}
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