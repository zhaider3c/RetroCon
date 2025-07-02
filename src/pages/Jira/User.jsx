/* eslint-disable react/prop-types */

import { Button, Card, Input, TextArea } from "pixel-retroui";
import { THEME } from "@pages/Theme";
import { useEffect, useState } from "react";
import Json from "@components/Json";

export default function Auth({ di }) {
    const [data, setData] = useState({});
    useEffect(() => {
        di.request.get({ url: di.api.get('jira-user'), callback: (data) => { setData(data.data) } })
    }, []);
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            {(data?.message || data?.error) ?
                <Card {...THEME.SECONDARY} className="flex flex-col w-1/2 gap-2 p-5 h-64 justify-center">
                    <p className="text-2xl font-bold">{data.message ?? data.error}</p>
                    <p className="text-lg text-gray-400">{data.error_description ?? "Please check your Jira account and try again."}</p>
                </Card>
                : <Card {...THEME.SECONDARY} className="flex flex-col w-1/2">
                    <p className="text-sm text-gray-600">ID: {data.accountId}</p>
                    <div className="flex justify-between items-end gap-2 p-5">
                        <p className="text-2xl font-bold">{data.displayName}</p>
                        <p className={"text-sm text-gray-600 " + `${data.active ? "text-green-500" : "text-red-500"}`}>{data.active ? "Active" : "Inactive"}</p>
                    </div>
                    <p className="text-sm text-gray-500">{data.emailAddress}</p>
                    <p className="text-sm text-gray-600">{data.accountType}</p>
                </Card>}
        </div>
    )
}