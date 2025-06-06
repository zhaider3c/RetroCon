import React, { useEffect } from 'react';

export default function Scroll({ children, className,itemsClass="flex flex-col gap-1 items-center justify-center", ...args }) {
    const [renderShadow, setRenderShadow] = React.useState(false);
    function showShadow(e) {
        setRenderShadow(e.target.clientHeight < e.target.scrollHeight);
        return e.target.clientHeight < e.target.scrollHeight;
    }
    return (
        <div
            onLoad={showShadow}
            onScroll={(e) => {
                if (!showShadow(e)) {
                    return false;
                }
                const scrollTop = e.target.scrollTop;
                const scrollHeight = e.target.scrollHeight;
                const clientHeight = e.target.clientHeight;

                if (scrollTop > 64) {
                    e.target.querySelector('#shadow-top').classList.remove('hidden');
                } else {
                    e.target.querySelector('#shadow-top').classList.add('hidden');
                }
                if (scrollTop + clientHeight >= scrollHeight) {
                    e.target.querySelector('#shadow-bottom').classList.add('hidden');
                } else {
                    e.target.querySelector('#shadow-bottom').classList.remove('hidden');
                }
            }}
            className={`overflow-auto h-full p-0 ${className}`}
            {...args}
        >
            <div id='shadow-top' className='hidden w-full sticky top-0 h-8 bg-linear-to-b from-black/50 to-transparent'></div>
            <div className={'flex '+itemsClass}>
                {children}
            </div>
            <div id='shadow-bottom' className={`${renderShadow ? "" : "hidden"} w-full sticky bottom-0 h-8 bg-linear-to-t from-black/50 to-transparent`}></div>
        </div>
    )
}