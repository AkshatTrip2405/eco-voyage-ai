type InputProps = {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};

export default function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label>{label}</label>}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border rounded p-2"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}