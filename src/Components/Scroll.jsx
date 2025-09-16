import React, { useEffect } from 'react';

export default function Scroll({ children, className, itemsClass, ...args }) {
    return (
        <div
            className={`overflow-auto h-full p-0 ${className}`}
            {...args}>
            <div className={'flex flex-col gap-1 items-center justify-center'}>
                {Array.isArray(children) ? children.map((e, i) => {
                    return (
                        <div className='w-full' key={i}>
                            {e}
                        </div>
                    )
                }) : (
                    <div className='w-full py-5'>
                        {children}
                    </div>
                )}
            </div>
        </div>
    )
}