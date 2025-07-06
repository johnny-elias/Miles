"use client";

import { useState } from 'react';

const fareClasses = [
    {
      label: "Economy",
      value: "economy",
      icon: (
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="6" rx="2" /><path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" /></svg>
      ),
    },
    {
      label: "Premium Economy",
      value: "premium",
      icon: (
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="6" rx="2" /><path d="M8 16v2a2 2 0 002 2h4a2 2 0 002-2v-2" /></svg>
      ),
    },
    {
      label: "Business",
      value: "business",
      icon: (
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="8" rx="3" /><path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" /></svg>
      ),
    },
    {
      label: "First",
      value: "first",
      icon: (
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="8" rx="4" /><path d="M12 8v8" /></svg>
      ),
    },
];

interface FareClassDropdownProps {
  selected: { label: string; value: string; icon: JSX.Element; };
  onSelect: (v: { label: string; value: string; icon: JSX.Element; }) => void;
  classes: { label: string; value: string; icon: JSX.Element; }[];
  className?: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function FareClassDropdown({ selected, onSelect, classes, className = '', isOpen, onToggle }: FareClassDropdownProps) {
  const handleSelect = (fareClass: { label: string; value: string; icon: JSX.Element; }) => {
    onSelect(fareClass);
    onToggle();
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        className="w-full min-w-max h-12 flex items-center justify-between px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 shadow"
        onClick={onToggle}
      >
        <div className="flex items-center">
          {selected.icon}
          <span className="whitespace-nowrap">{selected.label}</span>
        </div>
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {isOpen && (
        <ul className="absolute z-50 mt-1 w-full min-w-max bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow divide-y divide-gray-100 dark:divide-gray-800">
          {classes.map((f) => (
            <li key={f.value}>
              <button
                type="button"
                className={`flex items-center w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${selected.value === f.value ? 'font-semibold text-primary' : ''}`}
                onClick={() => handleSelect(f)}
              >
                {f.icon}
                <span className="whitespace-nowrap">{f.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}