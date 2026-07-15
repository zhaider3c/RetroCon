/* eslint-disable react/prop-types */
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { THEME } from '@pages/Theme';

/**
 * Shared page-level sidebar, built on retroui.dev's Card/Button (not pixel-retroui,
 * whose border-image bevel leaves gaps at the panel edges). `sections` is an array
 * of `{ title?, items }`, where each item is `{ key, label, active, onClick, className? }`.
 * `label` is the button content (string or node); `key` (defaults to `label`) is used
 * as the React key, useful when `label` is a node rather than a string.
 *
 * `theme='glass'` gives a translucent, blurred panel (tint via `glassClassName`);
 * `theme='default'` gives a solid panel using `panelTheme` (a THEME.X token, defaults
 * to THEME.ACTIVE).
 */
const PageSidebar = ({
    theme = 'glass',
    glassClassName = 'bg-black/20',
    panelTheme = THEME.ACTIVE,
    header,
    sections,
    className = '',
}) => {
    const isGlass = theme === 'glass';

    const panelStyle = isGlass
        ? {
            '--card': 'transparent',
            '--card-foreground': THEME.SECONDARY.textColor,
            '--border': THEME.SECONDARY.borderColor,
        }
        : {
            '--card': panelTheme.bg,
            '--card-foreground': panelTheme.textColor,
            '--border': panelTheme.borderColor,
        };

    return (
        <Card
            className={`retroui-scope flex flex-col gap-2 h-full overflow-hidden ${isGlass ? `${glassClassName} !backdrop-blur-md` : ''} w-48 shrink-0 ${className}`}
            style={panelStyle}
        >
            {header}
            <div className={`flex flex-col gap-2 px-2 pb-2 ${header ? '' : 'pt-2'}`}>
                {sections.map((section, si) => (
                    <React.Fragment key={si}>
                        {section.title && (
                            <p className='text-xs opacity-70 uppercase tracking-wide px-1 pt-2'>{section.title}</p>
                        )}
                        {section.items.map((item) => (
                            <Button
                                key={item.key ?? item.label}
                                variant={item.active ? 'default' : 'secondary'}
                                className={`w-40 mx-auto py-2 ${item.className ?? ''}`}
                                style={
                                    item.active
                                        ? { '--primary': THEME.SUCCESS.bg, '--primary-foreground': THEME.SUCCESS.textColor, '--primary-hover': THEME.SUCCESS_DARK.bg }
                                        : { '--secondary': THEME.SECONDARY.bg, '--secondary-foreground': THEME.SECONDARY.textColor, '--secondary-hover': THEME.ACTIVE_BUTTON.bg }
                                }
                                onClick={item.onClick}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </Card>
    );
};

export default PageSidebar;
