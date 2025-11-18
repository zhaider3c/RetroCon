import ReactJson from "@microlink/react-json-view";
import { Button, Card } from "pixel-retroui";
import { useEffect, useState } from "react";
import { THEME } from "../Theme";
import { TbTriangleFilled } from "react-icons/tb";




const Main = ({ di }) => {
    const [inventory, setInventory] = useState(null);
    const [cursorData, setCursorData] = useState(null);
    const [cursor, setCursor] = useState(false);
    const [page, setPage] = useState(1);

    function handleCursor(apiCursor, inc) {
        if (apiCursor) {
            setCursor(apiCursor);
        }
        let newPage = page + (inc ? 1 : -1);
        if (newPage > 0) {
            setPage(newPage);
        } else {
            setPage(1);
        }
    }

    useEffect(() => {
        di.request.get({
            url: di.api.get('product-inventory') + "?per_page=6" + (cursor ? `&cursor=${cursor}` : ""),
            callback: (res) => {
                setInventory(res.data);
                setCursorData(res.cursor);
            }
        });
    }, [cursor]);
    return (
        <div className="flex flex-col justify-between items-center gap-5 h-full">
            <div className="grow w-full bg-cover bg-center overflow-hidden grid grid-cols-2 gap-3 justify-start items-start p-1">
                {
                    inventory && inventory.map((item, index) => {
                        return (
                            <Card className="flex flex-col justify-between items-center gap-5 h-full" key={index} {...THEME.SECONDARY}>
                                <div className="flex justify-between items-center w-full gap-5 h-full">
                                    <div className="w-1/3 flex-col justify-between items-center bg-white/10 p-5 rounded-xl h-full">
                                        <p className="text-center">Available: {item.inventory.available}</p>
                                        <div className="flex justify-between items-center w-full">
                                            <p>On hand: {item.inventory.on_hand}</p>
                                            <p>Committed: {item.inventory.committed}</p>
                                        </div>
                                        <div className="flex-col justify-between items-center">
                                            <p className="text-center">
                                                Unavailable
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <p>Damaged :
                                                    {item.inventory.unavailable.damage}
                                                </p>
                                                <p>Other :
                                                    {item.inventory.unavailable.other}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-between items-start gap-3 h-full grow">
                                        <div className="flex-col grow justify-start items-start gap-3 h-full">
                                            {Object.keys(item).map((key, i) => {
                                                if (['inventory', 'parent_data'].includes(key)) {
                                                    return null;
                                                }
                                                return (
                                                    <p>{key}: {typeof item[key] === 'object' ? JSON.stringify(item[key]) : item[key]}</p>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                                {
                                    item.parent_data && (
                                        <div className="w-full bg-green-400/25 p-5 rounded-xl">
                                            <div className="flex flex-col justify-between items-start w-full">
                                                <p>Parent</p>
                                                <div className="grid grid-cols-2 justify-between items-start w-fit">
                                                    <span>ID</span>
                                                    <span>{item.parent_data.id}</span>
                                                    <span>Title</span>
                                                    <span>{item.parent_data.title}</span>
                                                    <span>SKU</span>
                                                    <span>{item.parent_data.sku}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </Card >
                        )
                    })
                }
            </div>

            <div className="flex justify-center items-end w-full h-14">
                <Card {...THEME.ACTIVE} className="flex justify-end items-center p-0">
                    <button onClick={() => { setPage((page - 1) > 0 ? page - 1 : 1); handleCursor(cursorData?.prev, false) }}>
                        <TbTriangleFilled className={`text-4xl -rotate-90  ${cursorData?.prev ? 'text-amber-400/75 hover:text-amber-400/100' : 'text-zinc-600'}`} /></button>
                    <div className="px-5 font-black">{page}</div>
                    <button onClick={() => { setPage(page + 1); handleCursor(cursorData?.next, true) }}>
                        <TbTriangleFilled className={`text-4xl rotate-90 ${cursorData?.next ? 'text-amber-400/75 hover:text-amber-400/100' : 'text-zinc-600'}`} /></button>
                </Card>
            </div>
        </div >
    )
}

export default Main;