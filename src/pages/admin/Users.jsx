/* eslint-disable react/prop-types */

import { Button, Card, Input, Popup, TextArea } from "pixel-retroui";
import { THEME } from "@pages/Theme";
import { useEffect, useState } from "react";
import Scroll from "@components/Scroll";
import ReactJson from "@microlink/react-json-view";
import { useNavigate } from "react-router-dom";
import Pagination from "@components/Paginator";

export default function Main({ di, token }) {
    const [users, setUsers] = useState([]);
    const [singleUser, setSingleUser] = useState(null);
    const [popupUser, setPopupUser] = useState(null);
    const [cursor, setCursor] = useState(null);
    const [activeCursor, setActiveCursor] = useState(null);
    const [page, setPage] = useState(1);

    const UNICON_FRONTEND = 'app.local.cedcommerce.com'; // <------------------- CHANGE!!!!

    useEffect(() => {
        di.request.get({
            url: di.api.get('admin-user') + '?per_page=10' + (activeCursor ? "&cursor=" + activeCursor : ""),
            headers: {
                'Authorization': `Bearer ${token}`,
                "Business": null
            }, callback: (res) => {
                setUsers(res.data);
                setCursor(res.cursor);
            }
        });
    }, [activeCursor]);

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
        <div className="flex flex-col-reverse gap-5 h-full p-5">
            <div className="w-full justify-center items-center flex grow">
                {popupUser?.access_token && (
                    <div className="justify-between items-center flex bg-black/50 p-5 rounded-xl">
                        <div className="w-fit h-full">
                            <ReactJson theme={THEME.JSON.DEFAULT}
                                src={di.decodedToken(popupUser.access_token)} />
                        </div>
                        <div className="w-1/2 overflow-hidden break-all text-lime-400">
                            {popupUser.access_token}
                        </div>
                    </div>
                )}
            </div>
            <div className="flex justify-center items-center w-full">
                <Pagination page={page} setPage={setPage} cursor={cursor} setNextCursor={setActiveCursor} />
            </div>
            <div className="justify-center items-start flex w-full">
                <div className="grid grid-cols-2 gap-3">
                    {
                        users?.length > 0 && users.map((user, index) => {
                            let joinnedAt = di.formatTime(Number(user.user_data.created_at ?? 0) / 1000)
                            let lastLogin = di.formatTime(Number(user?.user_data.user_stats?.last_login?.time?.$date?.$numberLong ?? 0) / 1000)
                            return (
                                <div
                                    {...THEME.ACTIVE}
                                    key={user.user_data._id.$oid}
                                    className={
                                        `grid grid-cols-3 justify-between px-3 py-1 items-center gap-3 bg-black/25 rounded-xl`
                                    }
                                >
                                    <div className="flex flex-col gap-0 max-w-64 overflow-hidden text-ellipsis whitespace-nowrap">
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
                                    <div className="flex justify-end items-center gap-3">
                                        <Button {...THEME.ACTIVE} className="text-sm" data-id={user.user_data._id.$oid} onClick={(e) => getToken(e.target.dataset.id)}>
                                            Get Token
                                        </Button>
                                        {popupUser?.access_token && user.user_data._id.$oid == di.decodedToken(popupUser.access_token).user_id && <Button {...THEME.ACTIVE} className="text-sm" data-id={user.user_data._id.$oid} onClick={(e) => {
                                            let url = "https://" + UNICON_FRONTEND + "?success=1&message=User+Logged+In&token=" + popupUser.access_token;
                                            window.open(url, '_blank');
                                        }}>
                                            Login
                                        </Button>}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}