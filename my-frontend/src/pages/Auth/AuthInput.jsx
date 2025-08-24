import React, { useState } from "react";

export default function AuthInput({
  type = "text",
  label,
  value,
  onChange,
  placeholder,
  autoComplete = "off",
  disabled = false,
}) {
  const [show, setShow] = useState(false);

  const renderInput = () => (
    <input
      type={type === "password" && show ? "text" : type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      required
      disabled={disabled}
    />
  );

  return (
    <div className="auth-field">
      <label>
        {label}
        {type === "password" ? (
          <div className="auth-pass-row">
            {renderInput()}
            <button
              type="button"
              className="auth-pass-toggle"
              onClick={() => setShow((v) => !v)}
              tabIndex={-1}
              disabled={disabled}
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
        ) : (
          renderInput()
        )}
      </label>
    </div>
  );
}
