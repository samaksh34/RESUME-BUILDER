import React from 'react';

const InputField = ({ label, value, onChange, placeholder, multiline = false, className = '', ...props }) => {
    const baseClasses = "input-base";

    if (multiline) {
        return (
            <div className={`flex flex-col gap-1.5 ${className}`}>
                {label && (
                    <label className="text-sm font-medium text-subtext">
                        {label}
                    </label>
                )}
                <textarea
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    rows={3}
                    className={baseClasses}
                    {...props}
                />
            </div>
        );
    }

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-subtext">
                    {label}
                </label>
            )}
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={baseClasses}
                {...props}
            />
        </div>
    );
};

export default InputField;
