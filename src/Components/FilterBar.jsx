/* eslint-disable react/prop-types */
import React from 'react';
import { Card } from 'pixel-retroui';
import { THEME } from '@pages/Theme';

const FilterBar = ({ children, className = '' }) => (
    <Card {...THEME.SECONDARY} className={`flex items-center gap-5 flex-wrap p-3 ${className}`}>
        {children}
    </Card>
);

export default FilterBar;
