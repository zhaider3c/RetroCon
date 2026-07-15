/* eslint-disable react/prop-types */
import React from 'react';
import { Card } from 'pixel-retroui';
import { THEME } from '@pages/Theme';

const ChipFilter = ({ label, value, options, onChange }) => (
    <Card {...THEME.ACTIVE} className='flex items-start gap-0.5 p-1!'>
        {label && (
            <span className='text-sm leading-none opacity-70 px-2 pt-0.5 select-none'>{label}</span>
        )}
        <div className='flex items-center gap-1'>
            {options.map((opt, i) => {
                const isActive = value === opt.value;
                return (
                    <button
                        key={i}
                        onClick={() => onChange(opt.value)}
                        className='px-3! py-1! rounded-md text-sm whitespace-nowrap transition-colors'
                        style={
                            isActive
                                ? { backgroundColor: THEME.SUCCESS.bg, color: THEME.SUCCESS.textColor }
                                : { backgroundColor: 'transparent', color: 'inherit' }
                        }
                        onMouseEnter={(e) => {
                            if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    </Card>
);

export default ChipFilter;
