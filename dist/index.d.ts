/// <reference types="react" />
import * as react_jsx_runtime from 'react/jsx-runtime';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary";
}
declare const Button: React.FC<ButtonProps>;

declare function Input(): react_jsx_runtime.JSX.Element;

export { Button, Input };
