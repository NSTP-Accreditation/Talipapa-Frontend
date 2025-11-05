import React from 'react';

/**
 * Props for FloatingLabelInput component
 */
interface FloatingLabelInputProps {
  /** The label text to display */
  label: string;
  /** The current input value */
  value: string;
  /** Change handler for input value */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Input type (default: 'text') */
  type?: string;
  /** Whether the field is required (default: false) */
  required?: boolean;
  /** Optional prefix inside the input (e.g. 'BT-') */
  prefix?: string | null;
  /** Additional classes for the input element */
  inputClassName?: string;
}

/**
 * FloatingLabelInput Component
 *
 * An input component with a floating label that animates when the input has a value or is focused.
 * Optionally supports a prefix (e.g., for record IDs like 'BT-123').
 *
 * @example
 * <FloatingLabelInput
 *   label="Record ID"
 *   value={recordId}
 *   onChange={(e) => setRecordId(e.target.value)}
 *   prefix="BT-"
 *   required
 * />
 */
const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  prefix = null,
  inputClassName = '',
}) => {
  // Match EarnPoints input sizing and style: px-3 py-2, border-2, bg-gray-50, font-normal
  const baseInputClasses =
    'w-full px-3 py-2 border-2 rounded-lg bg-gray-50 font-normal text-gray-800 peer focus:ring-2 focus:ring-green-500 focus:border-green-500';
  const inputClasses = prefix
    ? `w-full pl-12 pr-3 px-3 py-2 border-2 rounded-lg bg-gray-50 font-normal text-gray-800 peer focus:ring-2 focus:ring-green-500 focus:border-green-500 ${inputClassName}`
    : `${baseInputClasses} ${inputClassName}`;

  return (
    <label className="text-sm sm:text-base flex-1 relative w-full">
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className={inputClasses}
      />
      {prefix ? (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 select-none font-normal">
          {prefix}
        </span>
      ) : null}
      <span
        className={`absolute left-3.5 bg-gray-50 px-1 text-gray-500 transition-all duration-200 
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
