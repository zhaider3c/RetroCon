import React, { useEffect } from 'react';

export default function Marquee({ text, className, ...args }) {
    return (
        <div className={`overflow-hidden ${className}`}>
            <p className={`marquee w-full h-full`} {...args}>{text}</p>
        </div>
    )
}