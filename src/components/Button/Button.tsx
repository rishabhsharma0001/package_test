
export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

const Button: React.FC<ButtonProps> = ({ variant, ...props }) => {
  const colorClass = variant === 'primary' ? 'blue' : 'gray';
  return (
    <button style={{backgroundColor:colorClass}} className={`button ${colorClass}`} {...props} >
      {props.children}
    </button>
  );
};

export default Button;