import { useState } from "react";
import { TbTriangleFilled } from "react-icons/tb";
import { Button } from "pixel-retroui";
import { THEME } from "@pages/Theme";

const Pagination = ({ page = 1, setPage = () => { }, cursor, setNextCursor, textColor = 'text-lime-500', bgColor = 'bg-black/75' }) => {
    let prev = cursor?.prev;
    let next = cursor?.next;
    if (!prev) {
        setPage(1);
    }

    return (
        <div className={`flex justify-center items-center gap-0 overflow-hidden w-32 rounded-xl ${bgColor}`}>
            <Button {...THEME.SEAMLESS} className={`${prev ? '' : 'opacity-50'}`} onClick={() => { setNextCursor(prev ?? false); setPage(page - 1) }}>
                <TbTriangleFilled className={`-rotate-90 text-yellow-400/75 ${prev ? 'text-yellow-400/75 hover:text-yellow-400/100' : 'text-zinc-600'}`} />
            </Button>
            <div className={`${textColor} font-bold rounded-xl py-2 px-4 grow text-center`}>  {page > 0 ? page : 1}  </div>
            <Button {...THEME.SEAMLESS} className={`${next ? '' : 'opacity-50'}`} onClick={() => { setNextCursor(next ?? false); setPage(page + 1) }}>
                <TbTriangleFilled className={`rotate-90 text-yellow-400/75 ${next ? 'text-yellow-400/75 hover:text-yellow-400/100' : 'text-zinc-600'}`} />
            </Button>
        </div >
    )
}

export default Pagination;  