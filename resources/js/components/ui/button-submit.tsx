interface ButtonSubmitProps {
  value: string;
  disabled?: boolean;
  type?: "submit" | "button" | "reset";
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
}

export default function ButtonSubmit({value, disabled = false, type="submit", onClick}:ButtonSubmitProps) {
  return (
    <input
        type={type}
        value={value}
        disabled={disabled}
        onClick={onClick}
        className={`rounded-sm border border-green-600 p-1 font-medium text-green-600   dark:border-green-700  ${
            disabled ? 'opacity-50 cursor-progress' : 'cursor-pointer opacity-100 hover:text-white hover:bg-green-600 dark:hover:bg-green-700'
        }`}
    />
  )
}
