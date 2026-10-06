import { ReactNode, HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "glass" | "gold" | "surface";
  hoverable?: boolean;
}

export function Card({
  children,
  variant = "glass",
  hoverable = false,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`ui-card ui-card--${variant} ${hoverable ? "ui-card--hoverable" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
