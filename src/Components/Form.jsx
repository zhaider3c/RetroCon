import { Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, Input, DropdownMenuItem, TextArea } from "pixel-retroui"
import React, { useState } from "react";
import { THEME } from "@pages/Theme";
import Slider from "@components/Slider.jsx";

/**
 * 
 * @param Object fields - {input_type} 
 * @returns 
 */
export default function Form({
    di,
    onSubmit,
    fields,
    submitText = "Submit",
    className,
    theme,
    data,
    rememberMe = false,
    onChange = (data) => { },
    onRememberChange = (data) => { },
    beforeSubmit = null,
}) {
    const [formData, setFormData] = useState(() => { return data || {} });
    console.log('Initial:', data, formData);
    
    // Sync formData when data prop changes
    React.useEffect(() => {
        if (data) {
            setFormData(data);
        }
    }, [data]);
    
    // Initialize data state with field names
    React.useEffect(() => {
        const initialData = { ...formData };
        let hasChanges = false;
        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            if (field.type === 'select' && field.options && field.options.length > 0) {
                if (!initialData[fieldName]) {
                    initialData[fieldName] = field.options[0].value;
                    hasChanges = true;
                }
            } else {
                if (initialData[fieldName] === undefined) {
                    initialData[fieldName] = '';
                    hasChanges = true;
                }
            }
        });
        if (hasChanges) {
            setFormData(initialData);
        }
    }, [fields]);

    const handleInputChange = (fieldName, value) => {
        const newFormData = {
            ...formData,
            [fieldName]: value
        };
        setFormData(newFormData);
        onChange(newFormData);
    };

    const handleSelectChange = (fieldName, value) => {
        const newFormData = {
            ...formData,
            [fieldName]: value
        };
        setFormData(newFormData);
        onChange(newFormData);
    };

    function initiateSubmit(di) {
        // Check if data has at least one non-null/empty value
        console.log('Submit - data prop:', data, 'formData state:', formData);
        const hasValidData = Object.values(formData).some(value =>
            value !== null && value !== undefined && value !== ''
        );
        if (!hasValidData) {
            di.toast.error('No data to submit');
            return;
        }
        onSubmit(formData, di);
    }

    const renderField = (fieldName, field) => {
        switch (field.type) {
            case 'select':
                return (
                    <DropdownMenu {...THEME.ACTIVE} className="p-3 w-full">
                        <DropdownMenuTrigger className="w-full">
                            {field.options.find(option => option.value === formData[fieldName])?.label || 'Select...'}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="flex gap-3">
                            {field.options.map((option, index) => (
                                <DropdownMenuItem key={index}>
                                    <Button
                                        {...THEME.ACTIVE_INPUT}
                                        onClick={() => handleSelectChange(fieldName, option.value)}
                                    >
                                        {option.label}
                                    </Button>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );

            case 'textarea':
                return (
                    <TextArea
                        value={formData[fieldName]}
                        {...THEME.SEAMLESS}
                        {...field}
                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                    />
                );
            case 'password':
                return (
                    <Input
                        value={formData[fieldName]}
                        {...THEME.SEAMLESS}
                        type="password"
                        onFocus={(e) => { e.target.type = 'text' }}
                        onBlur={(e) => { e.target.type = 'password' }}
                        {...field}
                        className="w-full"
                        autoComplete="current-password"
                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                    />
                );
            default:
                return (
                    <Input
                        value={formData[fieldName]}
                        {...THEME.SEAMLESS}
                        {...field}
                        className="w-full"
                        autoComplete={formData[fieldName]}
                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                    />
                );
        }
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); initiateSubmit(di); }} className={"flex flex-col gap-2 justify-center w-full items-center h-full" + ` ${className}`}>
            {
                Object.keys(fields).map((x, y) => {
                    const field = fields[x];
                    return (
                        <div className="flex justify-between items-center w-full" key={y}>
                            <Card {...THEME.ACTIVE_INPUT} className="flex flex-col justify-center w-full items-start gap-0">
                                <label className="text-sm font-bold rounded-xl w-full">{fields[x].label}</label>
                                {renderField(x, field)}
                            </Card>
                        </div>
                    )
                })
            }
            <div className="flex flex-row flex-wrap items-center justify-start w-full gap-4">
                {beforeSubmit}
                <Button onClick={() => initiateSubmit(di)} {...THEME.ACTIVE_BUTTON} className="min-w-32">{submitText}</Button>
                {rememberMe && (
                    <div className="flex justify-end w-full items-center gap-2 p-0">
                        <Slider {...THEME.ACTIVE_BUTTON} className="w-16" onClick={(e) => {
                            onRememberChange(e.checked);
                        }} />
                        <label className="text-sm font-bold rounded-xl">Remember Me</label>
                    </div>
                )}
            </div>
        </form>
    )
}