'use client';
import { useState, useRef, useEffect } from 'react';

export default function CustomSelect({ value, onChange, options, placeholder = 'Seleccionar...', className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Botón principal */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-amber-50 dark:bg-white/10 backdrop-blur-sm border-2 border-amber-300 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 dark:text-white transition-all font-medium shadow-sm hover:shadow-md cursor-pointer text-left flex items-center justify-between"
      >
        <span>{selectedOption?.label || placeholder}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown desplegable */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-gradient-to-br from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 border-2 border-amber-300 dark:border-amber-500/30 rounded-xl shadow-2xl overflow-hidden">
          <div className="max-h-60 overflow-y-auto py-2">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-5 py-3 text-left font-medium transition-all duration-200 ${
                  value === option.value
                    ? 'bg-amber-200 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300'
                    : 'text-amber-900 dark:text-white hover:bg-amber-100 dark:hover:bg-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
