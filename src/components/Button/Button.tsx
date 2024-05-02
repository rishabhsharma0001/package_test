import React from "react";
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({ variant, ...props }) => {
  const colorClass = variant === "primary" ? "blue" : "red";
  return (
    <button style={{backgroundColor:colorClass}} className={`btn ${colorClass}`} {...props} onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export default Button;
