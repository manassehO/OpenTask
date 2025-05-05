import clsx from "clsx";
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  padding?: string;
  rounded?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  icon?: React.ReactNode | string;
  iconPosition?: "left" | "right";
  iconAlt?: string;
  iconSize?: number;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  backgroundColor = "bg-blue-600",
  textColor = "text-white",
  borderColor = "border-transparent",
  padding = "px-4 py-2",
  rounded = "rounded-md",
  className = "",
  type = "button",
  disabled = false,
  icon,
  iconPosition = "left",
  iconAlt = "icon",
  iconSize = 20,
}) => {
  const renderIcon = () => {
    if (typeof icon === "string") {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={icon}
          alt={iconAlt}
          className="inline-block"
          style={{ width: iconSize, height: iconSize }}
        />
      );
    }
    return (
      <span
        className="inline-block"
        style={{ width: iconSize, height: iconSize }}
      >
        {icon}
      </span>
    );
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "inline-flex items-center justify-center gap-2 border font-medium transition duration-200",
        backgroundColor,
        textColor,
        borderColor,
        padding,
        rounded,
        disabled ? "cursor-not-allowed opacity-50" : "hover:opacity-90",
        className,
      )}
    >
      {icon && iconPosition === "left" && renderIcon()}
      <span>{children}</span>
      {icon && iconPosition === "right" && renderIcon()}
    </button>
  );
};

export default Button;
