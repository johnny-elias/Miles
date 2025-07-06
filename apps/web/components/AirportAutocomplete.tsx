import { useState, useRef, useEffect } from 'react';
import airportsData from '../lib/airports.json';

interface Airport {
  iata: string;
  icao: string;
  name: string;
  city: string;
  country: string;
}

interface AirportAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Convert the airports object to an array and filter out those without IATA code
const airports: Airport[] = Object.values(airportsData)
  .filter((a: any) => a.iata && a.iata.length === 3)
  .map((a: any) => ({
    iata: a.iata,
    icao: a.icao,
    name: a.name,
    city: a.city,
    country: a.country,
  }));

function highlightMatch(text: string, query: string, highlightClass = "bg-blue-500 text-white") {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")})`, 'ig');
  return text.split(regex).map((part, i) =>
    regex.test(part) ? <span key={i} className={highlightClass + " rounded px-1"}>{part}</span> : part
  );
}

export default function AirportAutocomplete({ value, onChange, placeholder = "Airport, city, or code", className = '' }: AirportAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const query = inputValue.trim();
  let filtered: Airport[] = [];
  if (query.length > 0) {
    const q = query.toLowerCase();
    // Prioritize: IATA code, then city, then name, then country
    const byIata = airports.filter(a => a.iata.toLowerCase().startsWith(q));
    const byCity = airports.filter(a => !byIata.includes(a) && a.city?.toLowerCase().includes(q));
    const byName = airports.filter(a => !byIata.includes(a) && !byCity.includes(a) && a.name?.toLowerCase().includes(q));
    const byCountry = airports.filter(a => !byIata.includes(a) && !byCity.includes(a) && !byName.includes(a) && a.country?.toLowerCase().includes(q));
    filtered = [...byIata, ...byCity, ...byName, ...byCountry].slice(0, 5);
  }

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || filtered.length === 0) return;
    if (e.key === 'ArrowDown') {
      setHighlightedIdx(idx => (idx + 1) % filtered.length);
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setHighlightedIdx(idx => (idx - 1 + filtered.length) % filtered.length);
      e.preventDefault();
    } else if (e.key === 'Enter') {
      if (filtered[highlightedIdx]) {
        selectAirport(filtered[highlightedIdx]);
      }
      e.preventDefault();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }

  function selectAirport(airport: Airport) {
    setInputValue(`${airport.city} (${airport.iata}) - ${airport.name}`);
    onChange(airport.iata);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <input
        type="text"
        value={inputValue}
        onChange={e => {
          setInputValue(e.target.value);
          setIsOpen(true);
          setHighlightedIdx(0);
          onChange("");
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoComplete="off"
      />
      {isOpen && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 min-w-[28rem] max-w-full bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow divide-y divide-gray-100 dark:divide-gray-800 max-h-72 overflow-auto">
          {filtered.map((a, idx) => (
            <li key={a.iata + a.name}>
              <button
                type="button"
                className={`flex flex-col items-start w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 ${idx === highlightedIdx ? 'bg-blue-700' : ''}`}
                onMouseDown={() => selectAirport(a)}
                onMouseEnter={() => setHighlightedIdx(idx)}
              >
                <span className="font-semibold text-white">
                  {highlightMatch(a.city, query)}
                  {" "}
                  <span className="text-blue-300 font-bold">{highlightMatch(`(${a.iata})`, query, "bg-blue-500 text-white")}</span>
                  {" - "}
                  {highlightMatch(a.name, query)}
                  {a.country ? `, ${a.country}` : ''}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 