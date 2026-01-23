import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "outline";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant = "default", ...props }, ref) => {
    const baseStyle =
      "px-4 py-2 rounded-full transition-colors duration-300 ease-in-out";
    const variantStyles = {
      default: "bg-transparent",
      outline: "bg-transparent border border-white/50 hover:border-white",
    };

    const combinedClassName = `${baseStyle} ${
      variantStyles[variant]
    } ${className}`;

    return (
      <button className={combinedClassName} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
