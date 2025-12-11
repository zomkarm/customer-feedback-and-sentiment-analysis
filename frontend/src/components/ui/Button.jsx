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
  const baseStyles = "px-2 py-2 rounded font-medium focus:outline-none transition duration-200";

  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-indigo-600 text-indigo-600 hover:bg-indigo-50",
    ghost: "text-indigo-600 hover:bg-indigo-100"
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
