"use client";

import { useState } from 'react';

const tripTypes = [
    {
      label: "One-way",
      value: "oneway",
      icon: (
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
      ),
    },
    {
      label: "Round-trip",
      value: "roundtrip",
      icon: (
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H7a4 4 0 100 8" /></svg>
      ),
    },
    {
      label: "Multi-city",
      value: "multicity",
      icon: (
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="6" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="18" cy="12" r="2" /></svg>
      ),
    },
];

interface TripTypeDropdownProps {
  selected: { label: string; value: string; icon: JSX.Element; };
  onSelect: (v: { label: string; value: string; icon: JSX.Element; }) => void;
  types: { label: string; value: string; icon: JSX.Element; }[];
  className?: string;
}

export default function TripTypeDropdown({ selected, onSelect, types, className = '' }: TripTypeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (tripType: { label: string; value: string; icon: JSX.Element; }) => {
    onSelect(tripType);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
    <button
        type="button"
        className="w-full h-12 flex items-center justify-between px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 shadow"
        onClick={handleToggle}
      >
        <div className="flex items-center">
          {selected.icon}
          <span>{selected.label}</span>
        </div>
        <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {isOpen && (
        <ul className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow divide-y divide-gray-100 dark:divide-gray-800">
          {types.map((t) => (
            <li key={t.value}>
              <button
                type="button"
                className={`flex items-center w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${selected.value === t.value ? 'font-semibold text-primary' : ''}`}
                onClick={() => handleSelect(t)}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}