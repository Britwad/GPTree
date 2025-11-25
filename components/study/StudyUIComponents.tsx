"use client";

import * as React from "react";
import { colors } from "@/lib/colors";

// Utility function for className merging
export function cn(...inputs: (string | undefined | null | boolean | Record<string, boolean>)[]): string {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string") {
      classes.push(input);
    } else if (typeof input === "object") {
      for (const key in input) {
        if (input[key]) {
          classes.push(key);
        }
      }
    }
  }
  return classes.join(" ");
}

// Button Component
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variant === "default" && `text-white hover:opacity-90`,
          variant === "destructive" && "bg-red-600 text-white hover:bg-red-700",
          variant === "outline" && "border",
          variant === "secondary" && "bg-gray-100 text-gray-900 hover:bg-gray-200",
          variant === "ghost" && "hover:bg-gray-100",
          variant === "link" && "underline-offset-4 hover:underline",
          size === "default" && "h-10 px-4 py-2",
          size === "sm" && "h-9 rounded-md px-3",
          size === "lg" && "h-11 rounded-md px-8",
          size === "icon" && "h-10 w-10",
          className
        )}
        style={{
          ...(variant === "default" ? { backgroundColor: colors.green } : {}),
          ...(variant === "outline" ? { borderColor: colors.lightGray, color: colors.darkGray } : {}),
          ...(variant === "ghost" ? { color: colors.darkGray } : {}),
          ...(variant === "link" ? { color: colors.green } : {}),
        }}
        onMouseEnter={(e) => {
          if (variant === "default") {
            e.currentTarget.style.backgroundColor = colors.darkGreen;
          } else if (variant === "outline") {
            e.currentTarget.style.backgroundColor = colors.superLightGreen;
          }
        }}
        onMouseLeave={(e) => {
          if (variant === "default") {
            e.currentTarget.style.backgroundColor = colors.green;
          } else if (variant === "outline") {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// Card Component
export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border shadow-sm",
      className
    )}
    style={{ borderColor: colors.lightGray, backgroundColor: colors.white }}
    {...props}
  />
));
Card.displayName = "Card";

// Checkbox Component
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", onCheckedChange, checked, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
      props.onChange?.(e);
    };

    return (
      <input
        type="checkbox"
        className={cn(
          "h-4 w-4 rounded border focus:ring-2 focus:ring-offset-2",
          className
        )}
        style={{ borderColor: colors.lightGray, accentColor: colors.green }}
        ref={ref}
        checked={checked}
        onChange={handleChange}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";

// Badge Component
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
          variant === "default" && "text-white",
          variant === "secondary" && "hover:bg-gray-200",
          variant === "destructive" && "border-transparent bg-red-600 text-white hover:bg-red-700",
          className
        )}
        style={{
          ...(variant === "default" ? { backgroundColor: colors.green, borderColor: colors.green } : {}),
          ...(variant === "secondary" ? { backgroundColor: colors.lightGray, color: colors.darkGray } : {}),
          ...(variant === "outline" ? { borderColor: colors.lightGray, color: colors.darkGray } : {}),
        }}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

// Progress Component
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className = "", value = 0, max = 100, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full",
          className
        )}
        style={{ backgroundColor: colors.lightGray }}
        {...props}
      >
        <div
          className="h-full w-full flex-1 transition-all"
          style={{ backgroundColor: colors.green, transform: `translateX(-${100 - percentage}%)` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

