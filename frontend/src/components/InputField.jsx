import React from 'react';

const InputField = ({ label, value, onChange, placeholder, multiline = false, className = '', ...props }) => {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && (
                <label className="text-[12px] font-semibold text-subtext uppercase tracking-tight ml-0.5">
                    {label}
                </label>
            )}
            {multiline ? (
                <textarea
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    rows={3}
                    className="input-base min-h-[80px] resize-none"
                    {...props}
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="input-base"
                    {...props}
                />
            )}
        </div>
    );
};

export default InputField;
