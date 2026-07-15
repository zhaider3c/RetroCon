import { useEffect, useState } from "react";
import { THEME } from "../Theme";
import ProductTable, { Field } from "@components/ProductTable";
import Pagination from "@components/Paginator";


const InventoryStats = ({ inv }) => (
    <div
        className="w-2/5 max-w-56 shrink-0 p-3 rounded-lg flex flex-col gap-2"
        style={{
            backgroundColor: 'rgba(0, 200, 120, 0.08)',
            border: '1px solid rgba(0, 200, 120, 0.25)',
        }}
    >
        <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: THEME.SUCCESS.bg }}>
                {inv.available}
            </p>
            <p className="text-xs opacity-60">Available</p>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
            <span className="opacity-60">On hand</span><span className="text-right">{inv.on_hand}</span>
            <span className="opacity-60">Committed</span><span className="text-right">{inv.committed}</span>
            <span className="opacity-60">Damaged</span><span className="text-right">{inv.unavailable.damage}</span>
            <span className="opacity-60">Other</span><span className="text-right">{inv.unavailable.other}</span>
        </div>
    </div>
);

const ParentFooter = ({ data }) => (
    <div
        className="rounded-lg p-2 text-xs"
        style={{
            backgroundColor: 'rgba(63, 191, 63, 0.15)',
            border: '1px solid rgba(63, 191, 63, 0.3)',
        }}
    >
        <p className="font-bold mb-1 opacity-80">Parent</p>
        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
            <span className="opacity-60">ID</span><span className="truncate">{data.id}</span>
            <span className="opacity-60">Title</span><span className="truncate">{data.title}</span>
            <span className="opacity-60">SKU</span><span className="truncate">{data.sku}</span>
        </div>
    </div>
);


const Main = ({ di }) => {
    const [inventory, setInventory] = useState(null);
    const [cursorData, setCursorData] = useState(null);
    const [cursor, setCursor] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        di.request.get({
            url: di.api.get('product-inventory') + "?per_page=6" + (cursor ? `&cursor=${cursor}` : ""),
            callback: (res) => {
                setInventory(res.data);
                setCursorData(res.cursor);
            }
        });
    }, [cursor]);

    const SKIP_KEYS = ['inventory', 'parent_data'];
    const columns = inventory?.[0]
        ? Object.keys(inventory[0])
            .filter((k) => !SKIP_KEYS.includes(k))
            .map((k) => ({
                label: k.replaceAll('_', ' '),
                field: k,
                format: (v) => (typeof v === 'object' ? JSON.stringify(v) : String(v ?? '')),
            }))
        : [];

    return (
        <div className="flex flex-col justify-between items-center gap-5 h-full w-full min-w-0 overflow-hidden">
            <div className="grow w-full min-w-0 min-h-0 overflow-hidden flex p-1">
                <ProductTable
                    items={inventory}
                    columns={columns}
                    cols={2}
                    getLeading={(item) => <InventoryStats inv={item.inventory} />}
                    getFooter={(item) => item.parent_data ? <ParentFooter data={item.parent_data} /> : null}
                    emptyMessage="No inventory"
                />
            </div>

            <div className="flex justify-center items-end w-full h-14">
                <Pagination page={page} setPage={setPage} cursor={cursorData} setNextCursor={setCursor} />
            </div>
        </div >
    )
}

export default Main;