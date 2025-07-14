interface ButtonSubmitProps {
  value: string;
  disabled?: boolean;
  type?: "submit" | "button" | "reset";
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
}

export default function ButtonCancel({value, disabled = false, type="reset", onClick}:ButtonSubmitProps) {
  return (
    <input
        type={type}
        value={value}
        disabled={disabled}
        onClick={onClick}
        className={` rounded-sm border border-gray-500 p-1 font-medium text-gray-500  ${
            disabled ? 'opacity-50 cursor-progress' : 'cursor-pointer opacity-100 hover:bg-gray-500 hover:text-white '
        }`}
    />
  )
}
