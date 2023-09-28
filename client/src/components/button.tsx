type ButtonProps = {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    text: string;
};

export default function Button({ onClick, text }: ButtonProps) {
    return <button onClick={onClick}>{text}</button>;
}
