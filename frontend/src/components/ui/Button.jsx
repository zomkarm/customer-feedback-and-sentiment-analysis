// src/components/ui/Button.jsx
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const Button = ({
  children,
  type = "button",
  onClick,
  variant = "primary",
  className = "",
  disabled = false
}) => {
  const baseStyles = "px-4 py-2 rounded font-medium focus:outline-none transition duration-200";

  const variants = {
    primary: "bg-violet-600 text-white hover:bg-violet-700",
    secondary: "bg-violet-100 text-violet-800 hover:bg-violet-200",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-violet-600 text-violet-600 hover:bg-violet-50",
    ghost: "text-violet-600 hover:bg-violet-100"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames(baseStyles, variants[variant], className)}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(["primary", "secondary", "danger", "outline", "ghost"]),
  className: PropTypes.string,
  disabled: PropTypes.bool
};

export default Button;
