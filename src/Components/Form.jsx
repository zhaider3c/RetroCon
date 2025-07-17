import { Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, Input, DropdownMenuItem, TextArea } from "pixel-retroui"
import React, { useState } from "react";
import { THEME } from "@pages/Theme";
import Scroll from "@components/Scroll.jsx";

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
    onChange = (data) => { }
}) {
    const [formData, setFormData] = useState(data || {});

    // Initialize data state with field names
    React.useEffect(() => {
        const initialData = formData || {};
        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            if (field.type === 'select' && field.options && field.options.length > 0) {
                initialData[fieldName] = field.options[0].value;
            } else {
                initialData[fieldName] = '';
            }
        });
    }, [fields]);

    const handleInputChange = (fieldName, value) => {
        setFormData({
            ...formData,
            [fieldName]: value
        });
        onChange(formData);
    };

    const handleSelectChange = (fieldName, value) => {
        setFormData({
            ...formData,
            [fieldName]: value
        });
        onChange(formData);
    };

    function initiateSubmit(di) {
        // Check if data has at least one non-null/empty value
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
                            {formData[fieldName] || 'Select...'}
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
                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                    />
                );
        }
    };

    return (
        <div className={"flex flex-col gap-2 justify-center w-full items-center h-full" + ` ${className}`}>
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
            <div className="flex justify-start w-full p-0">
                <Button onClick={() => initiateSubmit(di)} {...THEME.ACTIVE_BUTTON} className="min-w-32">{submitText}</Button>
            </div>
        </div>
    )
}