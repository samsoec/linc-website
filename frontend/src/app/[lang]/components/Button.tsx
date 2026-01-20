import Link from "next/link";
import { ReactNode } from "react";
import LocaleLink from "./LocaleLink";

type ButtonType = "primary" | "secondary" | "tertiary";
type ButtonColor = "primary" | "secondary" | "accent";
type ButtonSize = "sm" | "md" | "lg";

interface BaseButtonProps {
  children: ReactNode;
  type?: ButtonType;
  color?: ButtonColor;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

interface ButtonAsButton extends BaseButtonProps {
  as?: "button";
  onClick?: () => void;
  disabled?: boolean;
}

interface ButtonAsLink extends BaseButtonProps {
  as: "link";
  href: string;
  target?: "_blank" | "_self";
  onClick?: () => void;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button({
  children,
  type = "primary",
  color = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  // Size classes
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-base",
  };

  // Base classes
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-full transition-colors duration-300";

  // Type and color combinations
  const getTypeColorClasses = () => {
    if (type === "primary") {
      switch (color) {
        case "primary":
          return "bg-primary text-white hover:bg-primary-light";
        case "secondary":
          return "bg-secondary text-primary hover:bg-secondary-dark";
        case "accent":
          return "bg-accent text-white hover:bg-accent-light";
      }
    }

    if (type === "secondary") {
      switch (color) {
        case "primary":
          return "bg-transparent text-primary border-2 border-primary hover:bg-primary/10";
        case "secondary":
          return "bg-transparent text-secondary border-2 border-secondary hover:bg-secondary/10";
        case "accent":
          return "bg-transparent text-accent border-2 border-accent hover:bg-accent/10";
      }
    }

    if (type === "tertiary") {
      switch (color) {
        case "primary":
          return "bg-transparent text-primary hover:text-primary-light";
        case "secondary":
          return "bg-transparent text-secondary hover:text-secondary-dark";
        case "accent":
          return "bg-transparent text-accent hover:text-accent-light";
      }
    }
  };

  const widthClass = fullWidth ? "w-full" : "";
  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${getTypeColorClasses()} ${widthClass} ${className}`;

  if (props.as === "link") {
    return (
      <LocaleLink
        href={props.href}
        target={props.target}
        onClick={props.onClick}
        className={combinedClasses}
      >
        {children}
      </LocaleLink>
    );
  }

  return (
    <button onClick={props.onClick} disabled={props.disabled} className={combinedClasses}>
      {children}
    </button>
  );
}
