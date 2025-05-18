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
  const baseStyles = "px-4 py-2 rounded font-medium focus:outline-none";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-400 text-gray-700 hover:bg-gray-100"
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
  variant: PropTypes.oneOf(["primary", "secondary", "danger", "outline"]),
  className: PropTypes.string,
  disabled: PropTypes.bool
};

export default Button;
