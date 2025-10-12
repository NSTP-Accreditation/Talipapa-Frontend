const FloatingLabelInput = ({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}) => {
  return (
    <label className="text-sm sm:text-base flex-1 relative w-full">
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full px-3.5 py-2.5 border rounded-lg text-green-primary font-medium bg-white peer focus:outline-none"
      />
      <span
        className={`absolute left-3.5 bg-white px-1 text-gray-500 transition-all duration-200 
          ${
            value
              ? '-top-2 text-xs'
              : 'top-1/2 -translate-y-1/2 peer-focus:-top-2 peer-focus:-translate-y-0 peer-focus:text-xs'
          }`}
      >
        {label}
      </span>
    </label>
  );
};

export default FloatingLabelInput;
