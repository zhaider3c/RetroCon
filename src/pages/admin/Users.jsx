/* eslint-disable react/prop-types */

import { Button, Card, Input, Popup, TextArea } from "pixel-retroui";
import { THEME } from "@pages/Theme";
import { useEffect, useState } from "react";
import Scroll from "@components/Scroll";
import ReactJson from "@microlink/react-json-view";

export default function Main({ di, token }) {
    const [users, setUsers] = useState([]);
    const [singleUser, setSingleUser] = useState(null);
    const [popupOpen, setPopupOpen] = useState(false);
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
    return (
        <div className='w-full h-full'>
            <Popup {...THEME.ACTIVE} isOpen={popupOpen} onClose={() => setPopupOpen(false)}>
                <div className="w-fit  h-128 ">
                    <Scroll>
                        <div>
                            <ReactJson theme="tomorrow" src={singleUser} />
                        </div>
                    </Scroll>
                </div>
            </Popup>
            <Scroll className="w-full h-full">
                <div className="h-full grid grid-cols-3 gap-5 justify-start w-full">
                    {users.map((user) => (
                        <Card key={user._id.$oid} {...THEME.ACTIVE} className="h-96 overflow-hidden" >
                            <div className="flex gap-2 py-3 justify-between bg-black/25 rounded-xl px-5 text-white/35">
                                <div className="text-sm flex gap-2 w-full items-center">
                                    <p className="font-bold">Last login:</p>
                                    <p className="">{di.formatTime(user.user_stats?.last_login.time.$date.$numberLong / 1000)}</p>
                                    <div className="grow flex justify-end">
                                        <Button {...THEME.SECONDARY} className="text-sm px-5!" data-id={user._id.$oid}
                                            onClick={(e) => {
                                                setPopupOpen(true);
                                                di.request.get({
                                                    url: di.api.get('admin-user') + "?id=" + e.target.dataset.id, headers: {
                                                        'Authorization': `Bearer ${token}`,
                                                        "Business": null
                                                    }, callback: (res) => {
                                                        setSingleUser(res);
                                                    }
                                                });
                                            }}>Details</Button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl text-orange-400">{user.first_name ? `${user.first_name} ${user.last_name}` : user.username}</p>
                                <div className="flex gap-2 text-sm text-white/50">
                                    <div className="flex flex-col gap-2">
                                        <p className="px-3">{user.email}</p>
                                        {
                                            user.phone &&
                                            <p className="px-3">Ph: {user.phone_codes} {user.phone}</p>
                                        }
                                        {
                                            user.base_currency &&
                                            <p className="px-3">Currency: {user.base_currency}</p>
                                        }
                                    </div>
                                    <p className="text-sm flex gap-2 justify-end grow">
                                        <span className="">Joinned on </span>
                                        <span>{di.formatTime(user.created_at.$date.$numberLong / 1000)}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="w-full h-1 bg-white/10 my-5"></div>
                            <div className="flex flex-col gap-2">
                                <p className="text-lg text-orange-400">Businesses</p>
                                {
                                    Object.keys(user.businesses).map((business) => {
                                        return <div key={business} className="flex flex-col gap-2 bg-black/25 rounded-xl px-5 py-3">
                                            <div className="flex gap-2 justify-between">
                                                <p className="text-sm text-white/25">{user.businesses[business].business_id.$oid}</p>
                                                <p className="text-sm bg-orange-400 px-3 py-1 rounded-xl text-black font-black">{user.businesses[business].type.toUpperCase()}</p>
                                            </div>
                                            <p className="flex gap-2">
                                                <span className="text-white/50">Name:</span>
                                                <span>
                                                    {user.businesses[business].business_name}
                                                </span>
                                            </p>
                                            <p className="flex gap-2">
                                                <span className="text-white/50">Country (timezone):</span>
                                                <span>
                                                    {user.businesses[business].country} ({user.businesses[business].timezone})
                                                </span>
                                            </p>
                                        </div>
                                    })
                                }
                            </div>
                        </Card>
                    ))}
                </div>
            </Scroll >
        </div >
    )
}