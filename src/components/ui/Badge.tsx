import { ReactNode } from "react";

export type BadgeVariant = "available" | "reserved" | "sold" | "gold" | "neutral";

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = "neutral", children, className = "" }: BadgeProps) {
  return (
    <span className={`ui-badge ui-badge--${variant} ${className}`}>
      {children}
    </span>
  );
}
