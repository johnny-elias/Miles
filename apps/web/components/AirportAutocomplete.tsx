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
  multiple?: boolean;
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

export default function AirportAutocomplete({ 
  value, 
  onChange, 
  placeholder = "Airport, city, or code", 
  className = '',
  multiple = false 
}: AirportAutocompleteProps) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse multiple airports from value
  const selectedAirports = multiple ? value.split(',').filter(v => v.trim()) : [value];
  const displayValue = multiple ? selectedAirports.join(', ') : value;

  const query = inputValue.trim();
  let filtered: Airport[] = [];
  if (query.length > 0) {
    const q = query.toLowerCase();
    // Filter out already selected airports
    const selectedCodes = selectedAirports.map(code => code.trim().toUpperCase());
    const availableAirports = airports.filter(a => !selectedCodes.includes(a.iata));
    
    // Prioritize: IATA code, then city, then name, then country
    const byIata = availableAirports.filter(a => a.iata.toLowerCase().startsWith(q));
    const byCity = availableAirports.filter(a => !byIata.includes(a) && a.city?.toLowerCase().includes(q));
    const byName = availableAirports.filter(a => !byIata.includes(a) && !byCity.includes(a) && a.name?.toLowerCase().includes(q));
    const byCountry = availableAirports.filter(a => !byIata.includes(a) && !byCity.includes(a) && !byName.includes(a) && a.country?.toLowerCase().includes(q));
    filtered = [...byIata, ...byCity, ...byName, ...byCountry].slice(0, 5);
  }

  useEffect(() => {
    if (!multiple) {
      setInputValue(value);
    }
  }, [value, multiple]);

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
    if (multiple) {
      // Add to existing airports
      const newAirports = [...selectedAirports, airport.iata];
      onChange(newAirports.join(','));
      setInputValue('');
    } else {
      setInputValue(`${airport.city} (${airport.iata}) - ${airport.name}`);
      onChange(airport.iata);
    }
    setIsOpen(false);
  }

  function removeAirport(airportCode: string) {
    if (multiple) {
      const newAirports = selectedAirports.filter(code => code.trim() !== airportCode);
      onChange(newAirports.join(','));
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="space-y-2">
        <input
          type="text"
          value={inputValue}
          onChange={e => {
            setInputValue(e.target.value);
            setIsOpen(true);
            setHighlightedIdx(0);
            if (!multiple) {
              onChange("");
            }
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={multiple ? "Add airports..." : placeholder}
          className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="off"
        />
        
        {/* Display selected airports as tags */}
        {multiple && selectedAirports.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedAirports.map((code, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
              >
                {code.trim()}
                <button
                  type="button"
                  onClick={() => removeAirport(code.trim())}
                  className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
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