import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  className = "",
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className={`ui-input-group ${error ? "has-error" : ""} ${className}`}>
      {label && <label htmlFor={inputId} className="ui-input-label">{label}</label>}
      <div className="ui-input-wrapper">
        {icon && <span className="ui-input-icon">{icon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={`ui-input ${icon ? "has-icon" : ""}`}
          {...props}
        />
      </div>
      {error && <span className="ui-input-error">{error}</span>}
    </div>
  );
});

Input.displayName = "Input";
