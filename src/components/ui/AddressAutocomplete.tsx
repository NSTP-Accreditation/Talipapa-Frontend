import React, { useRef, useEffect, useState } from 'react';
import { MapPin, Loader2, X } from 'lucide-react';
import { useNominatim, NominatimSuggestion } from '@/hooks/useNominatim';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (suggestion: NominatimSuggestion) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  countryCode?: string;
  label?: string;
  error?: string;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = 'Enter address...',
  className = '',
  required = false,
  disabled = false,
  maxLength = 200,
  countryCode = 'ph',
  label,
  error,
}) => {
  const {
    query,
    setQuery,
    suggestions,
    loading,
    error: fetchError,
    clearSuggestions,
  } = useNominatim({
    debounceMs: 300,
    minLength: 3,
    countryCode,
    limit: 5,
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [addressSelected, setAddressSelected] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal query with external value
  useEffect(() => {
    if (value !== query) {
      setQuery(value);
    }
  }, [value, query, setQuery]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show dropdown when suggestions are available (but not if an address was already selected)
  useEffect(() => {
    if (!addressSelected) {
      setShowDropdown(suggestions.length > 0);
    }
  }, [suggestions, addressSelected]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange(newValue);
    setSelectedIndex(-1);

    // Reset the selection flag when user modifies the input
    if (addressSelected) {
      setAddressSelected(false);
    }
  };

  const handleSuggestionClick = (suggestion: NominatimSuggestion) => {
    // Extract any leading numbers/house numbers from user's query
    const userInput = query.trim();
    const suggestionAddress = suggestion.display_name;

    // Check if user input starts with a number (house/building number)
    const numberMatch = userInput.match(/^[\d\-\/]+\s*/);

    let finalAddress = suggestionAddress;

    if (numberMatch) {
      const houseNumber = numberMatch[0].trim();
      // Extract the street/road name from suggestion to check if it matches
      const suggestionParts = suggestionAddress.split(',');
      const firstPart = suggestionParts[0]?.trim() || '';

      // Check if user's input (minus the number) matches the beginning of suggestion
      const userStreetInput = userInput
        .substring(numberMatch[0].length)
        .trim()
        .toLowerCase();

      if (
        userStreetInput &&
        firstPart.toLowerCase().includes(userStreetInput)
      ) {
        // Prepend the house number to the suggestion
        finalAddress = `${houseNumber} ${suggestionAddress}`;
      }
    }

    setQuery(finalAddress);
    onChange(finalAddress);
    setShowDropdown(false);
    setAddressSelected(true); // Mark that an address has been selected
    clearSuggestions();

    if (onSelect) {
      onSelect(suggestion);
    }
  };

  const handleClear = () => {
    setQuery('');
    onChange('');
    clearSuggestions();
    setShowDropdown(false);
    setAddressSelected(false); // Reset selection flag when clearing
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        break;
    }
  };

  return (
    <div className="relative w-full">
      {label && (
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <MapPin className="w-4 h-4 text-green-600" />
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          className={`w-full px-4 py-3 pr-20 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} ${className}`}
          autoComplete="off"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {loading && (
            <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
          )}
          {query && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear address"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown with suggestions */}
      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.place_id}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full px-4 py-3 text-left hover:bg-green-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                index === selectedIndex ? 'bg-green-50' : ''
              }`}
            >
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">
                    {suggestion.display_name}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Error message */}
      {(error || fetchError) && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          {error || fetchError}
        </p>
      )}

      {/* Helper text */}
      {!error && !fetchError && query.length > 0 && query.length < 3 && (
        <p className="mt-1 text-xs text-gray-500">
          Type at least 3 characters to see suggestions
        </p>
      )}
    </div>
  );
};

export default AddressAutocomplete;
