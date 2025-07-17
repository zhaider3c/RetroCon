/* eslint-disable react/prop-types */

import { Button, Card, Input, TextArea } from "pixel-retroui";
import { THEME } from "@pages/Theme";
import { useEffect, useState } from "react";
import Json from "@components/Json";
import Scroll from "@components/Scroll";

export default function Auth({ di }) {
    const [data, setData] = useState({});
    const [issues, setIssues] = useState([]);
    const sperintField = "customfield_10020";
    const taskBaseUrl = "https://cedcommerceinc.atlassian.net/browse/";
    useEffect(() => {
        di.request.get({ url: di.api.get('jira-user'), callback: (data) => { setData(data.data) } })
    }, []);

    useEffect(() => {
        if (data.accountId) {
            di.request.get({ url: di.api.get('jira-user-issue') + "?user_id=" + data.accountId, callback: (data) => { setIssues(data.data) } })
        }
    }, [data]);
    return (
        <div className="flex flex-col items-start justify-start h-full gap-4">
            {(data?.message || data?.error) ?
                <Card {...THEME.SECONDARY} className="flex flex-col gap-2 p-5 h-64 justify-center">
                    <p className="text-2xl font-bold">{data.message ?? data.error}</p>
                    <p className="text-lg text-gray-400">{data.error_description ?? "Please check your Jira account and try again."}</p>
                </Card>
                : <Card {...THEME.SECONDARY} className="flex flex-col">
                    <p className="text-sm text-gray-600">{data.accountId}</p>
                    <div className="flex justify-between items-end gap-2 p-5">
                        <p className="text-2xl font-bold">{data.displayName}</p>
                        <p className={"text-sm text-gray-600 " + `${data.active ? "text-green-500" : "text-red-500"}`}>{data.active ? "Active" : "Inactive"}</p>
                    </div>
                    <p className="text-sm text-gray-500">{data.emailAddress}</p>
                    <p className="text-sm text-gray-600">{data.accountType}</p>
                </Card>
            }
            <div className="flex flex-col w-full">
                <div className="flex gap-2 h-128 overflow-hidden justify-between">
                    {Array.isArray(issues.issues) && issues.issues.length > 0 ? (
                        (() => {
                            // Group issues by status name
                            const grouped = issues.issues.reduce((acc, issue) => {
                                const status = issue.fields.status?.name ?? "No Status";
                                if (!acc[status]) acc[status] = [];
                                acc[status].push(issue);
                                return acc;
                            }, {});
                            return Object.entries(grouped).map(([status, issuesInStatus]) => (
                                <Card key={status} className="overflow-hidden flex flex-col" {...THEME.SECONDARY}>
                                    <div className="font-semibold text-lg text-gray-200 mb-2">{status}</div>
                                    <Scroll>
                                        <div className="flex flex-col gap-2">
                                            {issuesInStatus.map((issue) => (
                                                <Button key={issue.key} className="cursor-pointer text-start" {...THEME.ACTIVE} onClick={() => {
                                                    window.open(taskBaseUrl + issue.key, "_blank");
                                                }}>
                                                    <div className="flex justify-start items-center gap-3">
                                                        <img src={issue.fields.issuetype.iconUrl} />
                                                        <p className="text-sm text-blue-500"><a target="_blank" href={"https://cedcommerceinc.atlassian.net/browse/" + issue.key}>{issue.key}</a></p>
                                                        {issue.fields[sperintField] && <div className="text-sm text-gray-600 flex gap-2">
                                                            <span>Sprints:</span>
                                                            {issue.fields[sperintField].map((sperint) => <p>{sperint.name.replace("UNICON Sprint ", "")}</p>)}
                                                        </div>}
                                                    </div>
                                                    <p className="text-gray-300">{issue.fields.summary}</p>
                                                </Button>
                                            ))}
                                        </div>
                                    </Scroll>
                                </Card>
                            ));
                        })()
                    ) : issues?.errorMessages ? (
                        <div>
                            <p className="text-rose-400">{issues.errorMessages || "Error loading issues."}</p>
                            <p className="text-sm text-gray-600">{issues.url}</p>
                        </div>
                    ) : (
                        <p className="text-gray-400">No issues found.</p>
                    )}
                </div>
            </div>
        </div>
    )
}