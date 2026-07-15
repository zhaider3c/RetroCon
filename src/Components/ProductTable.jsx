/* eslint-disable react/prop-types */
import React from 'react';
import { Button, Card } from 'pixel-retroui';
import { THEME } from '@pages/Theme';
import { GrDocumentMissing } from 'react-icons/gr';

export const Pill = ({ theme, children, className = '' }) => (
    <span
        className={`px-2 py-0.5 rounded text-xs whitespace-nowrap ${className}`}
        style={
            theme
                ? { backgroundColor: theme.bg, color: theme.textColor }
                : { backgroundColor: 'rgba(255,255,255,0.1)' }
        }
    >
        {children}
    </span>
);

export const Badge = ({ icon, label, theme, className = '' }) => (
    <span
        className={`group inline-flex items-center px-1.5 py-1 rounded text-xs overflow-hidden whitespace-nowrap align-middle ${className}`}
        style={{
            backgroundColor: theme?.bg ?? 'rgba(255,255,255,0.1)',
            color: theme?.textColor ?? 'inherit',
        }}
        title={label}
    >
        <span className="shrink-0 inline-flex items-center justify-center text-sm">
            {icon}
        </span>
        <span className="max-w-0 group-hover:max-w-32 overflow-hidden transition-all duration-300 ease-out">
            <span className="pl-1.5 capitalize">{label}</span>
        </span>
    </span>
);

export const Field = ({ label, children }) => (
    <div className="flex flex-col min-w-0">
        {label && <span className="text-xs opacity-60 capitalize">{label}</span>}
        <span className="truncate">{children}</span>
    </div>
);

const resolveTheme = (theme, value, row) =>
    typeof theme === 'function' ? theme(value, row) : theme;

const Cell = ({ col, row }) => {
    if (col.render) return col.render(row);
    const value = col.field ? row[col.field] : null;
    const display = col.format ? col.format(value, row) : value;
    if (display === null || display === undefined || display === '') return null;
    if (col.pill) {
        return <Pill theme={resolveTheme(col.theme, value, row)}>{display}</Pill>;
    }
    return <Field label={col.label}>{display}</Field>;
};

const ImageBox = ({ src, size = 'w-16 h-16' }) => (
    <div
        className={`${size} self-start shrink-0 rounded-lg overflow-hidden relative flex items-center justify-center`}
        style={{ backgroundColor: THEME.ACTIVE.baseBg }}
    >
        {src && (
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url('${src}')`,
                    filter: 'blur(10px)',
                    transform: 'scale(1.25)',
                }}
            />
        )}
        {src ? (
            <img className="relative max-w-full max-h-full object-contain" src={src} />
        ) : (
            <GrDocumentMissing className="relative text-2xl text-zinc-500" />
        )}
    </div>
);

const Row = ({ row, columns, actions, getImage, getLeading, getHeader, getBadges, getFooter }) => (
    <div className="flex flex-col gap-2 p-3">
        <div className="flex gap-3 items-stretch">
            {getLeading
                ? getLeading(row)
                : getImage
                    ? <ImageBox src={getImage(row)} />
                    : null}
            <div className="flex flex-col grow gap-2 min-w-0">
                {getHeader && <div className="min-w-0 shrink-0">{getHeader(row)}</div>}
                {columns.length > 0 && (
                    <div
                        className="grid grow gap-x-4 gap-y-1 items-center min-w-0"
                        style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
                    >
                        {columns.map((col, ci) => (
                            <div key={ci} className="min-w-0">
                                <Cell col={col} row={row} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {getBadges && (
                <div className="flex flex-col gap-1.5 shrink-0 items-end justify-start">
                    {getBadges(row)}
                </div>
            )}
            {actions.length > 0 && (
                <div className="flex flex-col gap-2 shrink-0 items-end justify-center">
                    {actions.map((a, ai) =>
                        a.render ? (
                            <React.Fragment key={ai}>{a.render(row)}</React.Fragment>
                        ) : (
                            <Button
                                key={ai}
                                {...(a.theme ?? THEME.ACTIVE)}
                                className="text-xs px-3 py-1"
                                onClick={() => a.onClick(row)}
                            >
                                {a.label}
                            </Button>
                        )
                    )}
                </div>
            )}
        </div>
        {getFooter?.(row)}
    </div>
);

const ProductTable = ({
    items,
    columns = [],
    actions = [],
    getImage,
    getLeading,
    getHeader,
    getBadges,
    getFooter,
    cols = 1,
    emptyMessage = 'No items',
    idKey = 'id',
}) => {
    if (!items || items.length === 0) {
        return (
            <Card {...THEME.SECONDARY} className="p-5 w-full grow flex items-center justify-center">
                <div className="opacity-60 text-center">{emptyMessage}</div>
            </Card>
        );
    }

    const gridCols = cols === 2 ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1';

    return (
        <Card {...THEME.SECONDARY} className="w-full grow flex flex-col p-0! overflow-hidden min-h-0">
            <div className={`grid ${gridCols} auto-rows-min content-start divide-y divide-x-0 divide-white/25 [&>*:nth-child(even)]:bg-white/5 grow overflow-auto`}>
                {items.map((row, idx) => (
                    <Row
                        key={row?.[idKey] ?? idx}
                        row={row}
                        columns={columns}
                        actions={actions}
                        getImage={getImage}
                        getLeading={getLeading}
                        getHeader={getHeader}
                        getBadges={getBadges}
                        getFooter={getFooter}
                    />
                ))}
            </div>
        </Card>
    );
};

export default ProductTable;
