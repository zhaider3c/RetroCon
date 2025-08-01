/* eslint-disable react/prop-types */

import { Button, Card, Input, Popup, TextArea } from "pixel-retroui";
import { THEME } from "@pages/Theme";
import { useEffect, useState } from "react";
import Scroll from "@components/Scroll";
import ReactJson from "@microlink/react-json-view";
import { useNavigate } from "react-router-dom";

export default function Main({ di, token }) {
    const [users, setUsers] = useState([]);
    const [singleUser, setSingleUser] = useState(null);
    const [popupUser, setPopupUser] = useState(null);
    useEffect(() => {
        di.request.get({
            url: di.api.get('admin-user'), headers: {
                'Authorization': `Bearer ${token}`,
                "Business": null
            }, callback: (res) => {
                setUsers(res.data);
            }
        });
    }, []);

    function getToken(id) {
        di.request.get({
            url: di.api.get('admin-user-token') + "?user_id=" + id, headers: {
                'Authorization': `Bearer ${token}`,
                "Business": null
            }, callback: (res) => {
                setPopupUser({ ...res });
            }
        });
    }

    return (
        <div className="flex gap-5 h-120">
            <div className="w-180 justify-center items-center flex">
                <div className="w-full text-sm text-gray-400 w-128 h-128 break-all justify-center items-center flex">
                    {/* <ReactJson src={popupUser} /> */}
                    {popupUser?.access_token}
                </div>
            </div>
            <div className="grow justify-center items-center flex h-full">
                <Scroll className="justify-center items-center h-full">
                    <div className="flex flex-col bg-black/25 h-full">
                        {
                            users.length > 0 && users.map((user, index) => {
                                let joinnedAt = di.formatTime(Number(user.user_data.created_at ?? 0) / 1000)
                                let lastLogin = di.formatTime(Number(user?.user_data.user_stats?.last_login?.time?.$date?.$numberLong ?? 0) / 1000)
                                return (
                                    <div
                                        {...THEME.ACTIVE}
                                        key={user.user_data._id.$oid}
                                        className={
                                            `grid grid-cols-3 justify-between px-3 py-1 items-center gap-0 ` +
                                            (index % 2 === 1 ? "bg-slate-800" : "")
                                        }
                                    >
                                        <div className="flex flex-col gap-0">
                                            {/* <span className="text-xs text-gray-400">{user.user_data._id.$oid}</span> */}
                                            <p>{
                                                user.user_data.name ??
                                                (user.user_data.first_name ? user.user_data.first_name + " " + user.user_data.last_name : undefined) ??
                                                user.user_data.username
                                            }</p>
                                            <span className="text-xs text-amber-400">{user.user_data.email}</span>
                                        </div>
                                        <div className="flex flex-col gap-0">
                                            <span className="text-xs text-gray-400">
                                                Accounts {user.account_data?.length ?? 0}
                                            </span>
                                            {joinnedAt && <span className="text-xs text-gray-400">
                                                Joinned at :{joinnedAt}
                                            </span>}
                                            {lastLogin && <span className="text-xs text-gray-400">
                                                Last login :{lastLogin}
                                            </span>}
                                        </div>
                                        <Button {...THEME.ACTIVE} className="text-sm" data-id={user.user_data._id.$oid} onClick={(e) => getToken(e.target.dataset.id)}>
                                            Get Token
                                        </Button>
                                    </div>
                                )
                            })
                        }
                    </div>
                </Scroll>
            </div>
        </div>
    )
}