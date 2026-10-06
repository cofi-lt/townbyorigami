import { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "gold";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  children?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  children,
  fullWidth = false,
  className = "",
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`ui-btn ui-btn--${variant} ui-btn--${size} ${fullWidth ? "ui-btn--full" : ""} ${className}`}
      style={style}
      {...props}
    >
      {icon && iconPosition === "left" && <span className="ui-btn__icon ui-btn__icon--left">{icon}</span>}
      {children && <span className="ui-btn__text">{children}</span>}
      {icon && iconPosition === "right" && <span className="ui-btn__icon ui-btn__icon--right">{icon}</span>}
    </button>
  );
}
