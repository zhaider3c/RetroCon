/* eslint-disable react/prop-types */
import { TbTriangleFilled } from "react-icons/tb";
import { Button } from "pixel-retroui";
import { THEME } from "@pages/Theme";

const Pagination = ({ cursor, setNextCursor, setPage, textColor = 'text-lime-500', bgColor = 'bg-black/75' }) => {
    let prev = cursor?.prev;
    let next = cursor?.next;

    function getPage() {
        let pageNo = 1;
        if (cursor) {
            if (cursor.prev) {
                pageNo = JSON.parse(atob(cursor.prev)).page + 1;
            } else if (cursor.next) {
                pageNo = JSON.parse(atob(cursor.next)).page - 1;
            } else {
                pageNo = 1;
            }
        } else {
            pageNo = 1;
        }
        if (setPage) setPage(pageNo);
        return pageNo;
    }
    return (
        <div className={`flex justify-center items-center gap-0 overflow-hidden w-32 rounded-xl ${bgColor}`}>
            <Button {...THEME.SEAMLESS} className={`${prev ? '' : 'opacity-50'}`} onClick={() => { setNextCursor(prev ?? false); }}>
                <TbTriangleFilled className={`-rotate-90 text-yellow-400/75 ${prev ? 'text-yellow-400/75 hover:text-yellow-400/100' : 'text-zinc-600'}`} />
            </Button>
            <div className={`${textColor} font-bold rounded-xl py-2 px-4 grow text-center`}>  {getPage()}  </div>
            <Button {...THEME.SEAMLESS} className={`${next ? '' : 'opacity-50'}`} onClick={() => { setNextCursor(next ?? false); }}>
                <TbTriangleFilled className={`rotate-90 text-yellow-400/75 ${next ? 'text-yellow-400/75 hover:text-yellow-400/100' : 'text-zinc-600'}`} />
            </Button>
        </div >
    )
}

export default Pagination;  