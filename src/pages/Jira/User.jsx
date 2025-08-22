/* eslint-disable react/prop-types */

import { Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Input, TextArea } from "pixel-retroui";
import { THEME } from "@pages/Theme";
import { useEffect, useState } from "react";
import Scroll from "@components/Scroll";
import { PiHourglass } from "react-icons/pi";
import { BiSolidHourglass } from "react-icons/bi";

// Function to convert seconds to readable time, only keeping non-zero fields
function convertSecondsToTime(seconds) {
    // One day is 9 hours (32400 seconds)
    let days = Math.floor(seconds / 32400);
    let hours = Math.floor((seconds % 32400) / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;
    let parts = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    if (secs) parts.push(`${secs}s`);
    return parts.length ? parts.join(' ') : '0s';
}

export default function Auth({ di }) {
    const sperintField = "customfield_10020";
    const taskBaseUrl = "https://cedcommerceinc.atlassian.net/browse/";

    const [data, setData] = useState({});
    const [issues, setIssues] = useState({});
    const [sprint, setSprint] = useState(() => localStorage.getItem('jira_sprint') || "all");
    const [project, setProject] = useState("UN");
    const [sprints, setSprints] = useState([]);
    const [activeTab, setActiveTab] = useState(null);

    let totalTime = { total: 0 };

    useEffect(() => {
        di.request.get({ url: di.api.get('jira-user'), callback: (data) => { setData(data.data) } })
    }, []);

    useEffect(() => {
        if (data?.accountId) {
            di.request.get({ url: di.api.get('jira-user-issue') + "?user_id=" + data.accountId + "&sprint=" + sprint + "&project=" + project, callback: (data) => { setIssues(data.data) } })
        }
    }, [data, sprint, project]);


    function Filters() {
        return (
            <div className="flex justify-end items-center gap-5">
                <div>
                    <DropdownMenu className="">
                        <DropdownMenuTrigger className="h-full flex items-start justify-between gap-0" {...THEME.ACTIVE}>
                            <div className="flex flex-col items-start justify-between gap-0">
                                <p className="text-sm text-start w-full">Sprint</p>
                                <p className="text">{sprint || "All"}</p>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent {...THEME.ACTIVE} className="h-96">
                            <Scroll>
                                <div className="flex flex-col gap-2 justify-between items-center">
                                    {sprints.map((singelSprint, i) => (
                                        <DropdownMenuItem key={i}>
                                            <Button
                                                className="w-64"
                                                onClick={() => setSprint(singelSprint)}
                                                {...THEME.SECONDARY}
                                            >
                                                {singelSprint}
                                            </Button>
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuItem className="w-full flex justify-between">
                                        <Button
                                            className="w-full"
                                            key={"All"}
                                            onClick={() => setSprint("all")}
                                            {...THEME.SECONDARY}
                                        >
                                            All
                                        </Button>
                                    </DropdownMenuItem>
                                </div>
                            </Scroll>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Card className="flex flex-col items-start justify-center" {...THEME.ACTIVE}>
                    <p className="text-sm p-0 m-0">Project</p>
                    <input
                        className="text-sm text-lime-500 text-center"
                        onChange={(e) => {
                            if (window.projectDebounce) clearTimeout(window.projectDebounce);
                            const value = e.target.value;
                            window.projectDebounce = setTimeout(() => {
                                setProject(value);
                                localStorage.setItem('jira_project', value);
                            }, 700);
                        }}
                        defaultValue={project}
                    />
                </Card>
            </div>
        );
    }

    function Tasks() {
        return (
            <div className="flex flex-col w-full grow">
                <div className="flex flex-col gap-5 overflow-hidden justify-between h-full">
                    {Array.isArray(issues?.issues) && issues.issues.length > 0 ? (
                        (() => {
                            // Group issues by status name
                            const grouped = issues.issues.reduce((acc, issue) => {
                                const status = issue.fields.status?.name ?? "No Status";
                                if (!acc[status]) acc[status] = [];
                                acc[status].push(issue);
                                return acc;
                            }, {});
                            // Tabbed view for statuses
                            if (!activeTab) setActiveTab(Object.keys(grouped)[0]);
                            // Calculate total times for all statuses
                            Object.entries(grouped).forEach(([status, issuesInStatus]) => {
                                totalTime[status] = 0;
                                issuesInStatus.forEach((issue) => {
                                    totalTime[status] += Number(issue.fields.timeoriginalestimate);
                                    totalTime.total += Number(issue.fields.timeoriginalestimate);
                                });
                            });

                            return (
                                <div className="flex w-full h-full gap-4">
                                    {/* Sidebar with tab headers */}
                                    <div className="flex flex-col gap-2 w-48 min-w-48">
                                        {Object.keys(grouped).map((status) => (
                                            <Button
                                                key={status}
                                                {...(activeTab === status ? THEME.SUCCESS : THEME.SECONDARY)}
                                                className="text-sm text-left justify-start h-auto"
                                                onClick={() => { setActiveTab(status); }}>
                                                <div className="flex flex-col items-start">
                                                    <span className="font-medium">{status}</span>
                                                    <span className="text-xs opacity-75">{convertSecondsToTime(totalTime[status] || 0)}</span>
                                                </div>
                                            </Button>
                                        ))}
                                    </div>
                                    {/* Tab content */}
                                    <div className="overflow-hidden flex flex-col justify-between items-start h-full">
                                        {Object.entries(grouped).map(([status, issuesInStatus]) => {
                                            if (status !== activeTab) return null;
                                            return (
                                                <div key={status} className="overflow-hidden flex flex-col w-full p-5 rounded-xl grow h-146">
                                                    <div className="flex justify-between items-center">
                                                        <div className="font-semibold text-gray-200">{status}</div>
                                                        <Filters />
                                                    </div>
                                                    <Scroll>
                                                        <div className="grid grid-cols-2 gap-3 w-full">
                                                            {issuesInStatus.map((issue) => {
                                                                if (issue.fields[sperintField]) {
                                                                    issue.fields[sperintField].map((x) => {
                                                                        if (!sprints.includes(x.name)) setSprints([...sprints, x.name]);
                                                                    })
                                                                }
                                                                return (
                                                                    <Card key={issue.key} className="flex flex-col gap-1 justify-between" {...THEME.SECONDARY}>
                                                                        <div className="flex gap-3 w-full">
                                                                            <div className="flex gap-3 items-center">
                                                                                <img src={issue.fields.issuetype.iconUrl} />
                                                                                <p className="text-xs text-blue-500"><a target="_blank" href={"https://cedcommerceinc.atlassian.net/browse/" + issue.key}>{issue.key}</a></p>
                                                                            </div>
                                                                            {issue.fields[sperintField] && (
                                                                                <div className="flex gap-1 bg-purple-800/50 rounded-sm px-1 py-1 text-xs">
                                                                                    <span className="text-gray-300 flex flex-col gap-0 whitespace-nowrap overflow-hidden">
                                                                                        {issue.fields[sperintField]
                                                                                            .slice() // clone to avoid mutating original
                                                                                            .sort((a, b) => a.id - b.id)[0].name}
                                                                                    </span>
                                                                                    {issue.fields[sperintField].length > 1 &&
                                                                                        <span className="text-gray-300/50 flex flex-col gap-0 justify-end items-end">
                                                                                             +{issue.fields[sperintField]
                                                                                                .length - 1}
                                                                                        </span>}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-gray-300 grow overflow-hidden">{issue.fields.summary}</p>
                                                                        <div className="flex gap-3">
                                                                            {issue.fields.timeoriginalestimate && <div className="text-gray-400 flex text-sm gap-2 items-center text-orange-400">
                                                                                <BiSolidHourglass /> {convertSecondsToTime(issue.fields.timeoriginalestimate)}
                                                                            </div>}
                                                                            <a href={taskBaseUrl + issue.key} target="_blank" rel="noopener noreferrer" onClick={() => {
                                                                                window.open(taskBaseUrl + issue.key, "_blank");
                                                                            }}
                                                                                className="text-sm text-blue-500!">View in JIRA</a>
                                                                        </div>
                                                                    </Card>
                                                                )
                                                            })}
                                                        </div>
                                                    </Scroll>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
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
        )
    }

    return (
        <div className="flex flex-col items-start justify-start h-full gap-5 overflow-hidden">
            {/* <Filters /> */}
            <Tasks />
        </div >
    )
}