import React from "react";
import PropTypes from "prop-types";

export default function Input({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  ...rest
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="input-wrap">
      {label && (
        <label htmlFor={inputId}>
          <span>{label}</span>
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...rest}
      />
      {error && (
        <div className="input-error" id={`${inputId}-error`}>
          {error}
        </div>
      )}
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
};
