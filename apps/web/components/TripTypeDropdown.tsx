"use client";

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
  value: string;
  onChange: (v: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export default function TripTypeDropdown({ value, onChange, isOpen, onToggle, className = '' }: TripTypeDropdownProps) {
  const selected = tripTypes.find((t) => t.value === value) || tripTypes[0];

  return (
    <div className={`relative ${className}`}>
    <button
        type="button"
        className="w-full h-12 flex items-center justify-between px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 shadow"
        onClick={onToggle}
      >
        <div className="flex items-center">
          {selected.icon}
          <span>{selected.label}</span>
        </div>
        <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {isOpen && (
        <ul className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow divide-y divide-gray-100 dark:divide-gray-800">
          {tripTypes.map((t) => (
            <li key={t.value}>
              <button
                type="button"
                className={`flex items-center w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${value === t.value ? 'font-semibold text-primary' : ''}`}
                onClick={() => onChange(t.value)}
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