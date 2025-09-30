/* eslint-disable react/prop-types */

import { Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Input, TextArea } from "pixel-retroui";
import { THEME } from "@pages/Theme";
import { useEffect, useState } from "react";

const Accounts = ({ di }) => {
    const [accounts, setAccounts] = useState([]);
    const [accountIndex, setAccountIndex] = useState(null);
    useEffect(() => {
        di.request.get({
            url: di.api.get('account-all'), callback: (data) => {
                setAccounts(data.data);
            }
        });
    }, []);

    function AccountList() {
        return (
            <div className='flex flex-col gap-2 justify-center items-start w-full'>
                <DropdownMenu>
                    <DropdownMenuTrigger {...THEME.SECONDARY}>
                        {accounts[accountIndex]?.name ?? "Select Account"}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="backdrop-blur-sm! bg-zinc-900/75!">
                        {accounts.map((account, index) => (
                            <DropdownMenuItem key={account.id} className="bg-transparent!">
                                <Button key={account.id} {...(index == accountIndex ? THEME.SUCCESS : THEME.SECONDARY)}
                                    onClick={() => setAccountIndex(index)}>
                                    {account.name}
                                </Button>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )
    }

    function Data({ account }) {

        if (!account) return (
            <div className='flex flex-col gap-2 grow w-full'>
                <p>No account selected</p>
            </div>
        );
        const ignoreKyes = ['setup_info', 'created_at', 'updated_at', 'name', 'expires_in', 'id', 'additional_data'];
        const censorKyes = ['api_key', 'api_secret', 'api_token', "access_token", 'refresh_token', 'shop_cipher'];
        return (
            <div className='flex flex-col gap-2 justify-center items-start backdrop-blur-lg! border-2! border-white! bg-white/50 rounded-xl p-0 w-fit text-zinc-800 max-w-256 overflow-hidden text-pretty break-all'>
                <div className="flex flex-col justify-center items-start w-full bg-blue-900/25 px-5 py-3">
                    <div className="flex justify-between items-start w-full">
                        {account.updated_at && <span className="text-sm">Updated: {di.formatTime(new Date(account.updated_at).getTime() / 1000)}</span>}
                        {account.created_at && <span className="text-sm">Created: {di.formatTime(new Date(account.created_at).getTime() / 1000)}</span>}
                    </div>
                    <div className="flex flex-col justify-center items-start w-full">
                        <span className='text-xl font-black text-slate-800'> {account.name} </span>
                        <span className='text-sm text-slate-800'>{account.id}</span>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-start w-full px-5 py-3">
                    {
                        Object.keys(account).map((key, index) => {
                            if (ignoreKyes.includes(key)) return null;
                            return (
                                <div key={key}>
                                    <span className='font-black'>{key}: </span>
                                    <span className={`${censorKyes.includes(key) ? 'blur-xs!' : ''} hover:blur-none!`}>
                                        {account[key].toString()}
                                    </span>
                                </div>
                            )
                        })
                    }
                </div>

            </div>
        )
    }
    function Step({ account }) {
        if (!account) return null;
        const [app, setApp] = useState(null);
        useEffect(() => {
            di.request.get({
                url: di.api.get('app') + '?filter[code][1]=' + account.name.split('_')[0].toLowerCase(),
                callback: (data) => {
                    setApp(data.data[0]);
                }
            });
        }, []);
        function findStep(parentCode, childCode) {
            const invalid = {
                parent: {
                    current: '??',
                    total: '??',
                },
                child: {
                    current: '??',
                    total: '??',
                }
            }
            if (!app) return invalid;
            let parent = app.steps.findIndex(step => step.code == parentCode);
            let child = app.steps[parent]?.sub_step.findIndex(step => step.code == childCode);

            if (parent == -1 || child == -1) return invalid;

            return {
                parent: {
                    current: parent,
                    total: app.steps.length,
                },
                child: {
                    current: child,
                    total: app.steps[parent].sub_step.length,
                },
            };
        }
        const stepData = account.setup_info ?? {};
        const count = findStep(stepData.current_step.parent_step, stepData.current_step.child_step);
        function prevStep(current) {
            let child = app.setup_info[current.parent.index-1];
            let parent = app.setup_info[current.parent.index-1];
         
        }
        function nextStep() {
            stepData.current_step.parent_step = count.parent.current + 1;
            stepData.current_step.child_step = count.child.current + 1;
        }
        return (
            <Card className='flex flex-col justify-center items-start w-fit gap-5' {...THEME.ACTIVE}>
                <p className="text-2xl">Setup Step</p>
                <div className="flex flex-col justify-center items-start w-full gap-5">
                    <div className="flex flex-col justify-between items-start w-full bg-blue-400/25 px-5 py-3 rounded-xl border-2! border-blue-400!">
                        <span className="font-black">Completed step </span>
                        <span className="px-5">{stepData.completed_step.parent_step} &gt; {stepData.completed_step.child_step} </span>
                    </div>
                    <div className="flex flex-col justify-between items-start w-full bg-green-400/25 px-5 py-3 rounded-xl border-2! border-green-400!">
                        <span className="font-black">Current step </span>
                        <span className="px-5">{stepData.current_step.parent_step} &gt; {stepData.current_step.child_step} </span>
                    </div>
                    <div className="flex justify-center items-center w-full">
                        <div className="flex justify-center items-center gap-5 bg-slate-500 rounded-xl text-white border-2! border-slate-300! overflow-hidden w-full h-10">
                            <button onClick={()=>{prevStep(count)}} className="grow text-center hover:bg-slate-800! hover:text-white! h-full">&lt;</button>
                            <p className="w-fit p-0 flex justify-center items-center gap-5">
                                <span>Step {count.parent.current}/{count.parent.total}</span>
                                <span>Sub Step {count.child.current}/{count.child.total}</span>
                            </p>
                            <button onClick={()=>{nextStep(count)}} className="grow text-center hover:bg-slate-800! hover:text-white! h-full">&gt;</button>
                        </div>
                    </div>
                </div>
            </Card>
        )
    }
    return (
        <div className='flex flex-col gap-5 w-full h-full justify-center items-center p-8'>
            <AccountList />
            <div className='grow w-full flex justify-start items-start gap-5'>
                <Data account={accounts[accountIndex]} />
                <Step account={accounts[accountIndex]} />
            </div>
        </div>
    );
};
export default Accounts;