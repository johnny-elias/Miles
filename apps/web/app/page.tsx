"use client";

import { useState, useRef, FC, useEffect } from 'react';
import MapPlaceholder from '../components/MapPlaceholder';
import TripTypeDropdown from '../components/TripTypeDropdown';
import PeopleDropdown from '../components/PeopleDropdown';
import FareClassDropdown from '../components/FareClassDropdown';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRouter } from 'next/navigation';

// --- MOCK DATA ---

interface Airport {
  code: string;
  city: string;
  name: string;
  lat: number;
  lon: number;
}

interface Route {
  origin: string;
  destination: string;
  miles: number;
}

const airports: Airport[] = [
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy Intl.', lat: 40.6413, lon: -73.7781 },
  { code: 'LAX', city: 'Los Angeles', name: 'Los Angeles Intl.', lat: 33.9416, lon: -118.4085 },
  { code: 'ORD', city: 'Chicago', name: 'O\'Hare Intl.', lat: 41.9742, lon: -87.9073 },
  { code: 'DFW', city: 'Dallas-Fort Worth', name: 'Dallas/Fort Worth Intl.', lat: 32.8998, lon: -97.0403 },
  { code: 'DEN', city: 'Denver', name: 'Denver Intl.', lat: 39.8561, lon: -104.6737 },
  { code: 'SFO', city: 'San Francisco', name: 'San Francisco Intl.', lat: 37.6213, lon: -122.3790 },
  { code: 'MIA', city: 'Miami', name: 'Miami Intl.', lat: 25.7959, lon: -80.2871 },
  { code: 'LHR', city: 'London', name: 'Heathrow Airport', lat: 51.4700, lon: -0.4543 },
  { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle Airport', lat: 49.0097, lon: 2.5479 },
  { code: 'HND', city: 'Tokyo', name: 'Haneda Airport', lat: 35.5494, lon: 139.7798 },
];

const routes: Route[] = [
  { origin: 'JFK', destination: 'LAX', miles: 25000 }, { origin: 'LAX', destination: 'JFK', miles: 25000 },
  { origin: 'JFK', destination: 'ORD', miles: 12000 }, { origin: 'ORD', destination: 'JFK', miles: 12000 },
  { origin: 'DFW', destination: 'DEN', miles: 8000 }, { origin: 'DEN', destination: 'DFW', miles: 8000 },
  { origin: 'SFO', destination: 'LAX', miles: 5000 }, { origin: 'LAX', destination: 'SFO', miles: 5000 },
  { origin: 'MIA', destination: 'JFK', miles: 15000 }, { origin: 'JFK', destination: 'MIA', miles: 15000 },
  { origin: 'JFK', destination: 'LHR', miles: 35000 }, { origin: 'LHR', destination: 'JFK', miles: 35000 },
  { origin: 'LAX', destination: 'HND', miles: 55000 }, { origin: 'HND', destination: 'LAX', miles: 55000 },
  { origin: 'CDG', destination: 'MIA', miles: 45000 }, { origin: 'MIA', destination: 'CDG', miles: 45000 },
];

// --- MOCK SEARCH FUNCTION ---
const findFlights = (originCode: string, destinationCode: string): Route[] => {
    if (!originCode || !destinationCode) return [];
    return routes.filter(r => r.origin.toLowerCase() === originCode.toLowerCase() && r.destination.toLowerCase() === destinationCode.toLowerCase());
};

// --- COMPONENTS ---

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" {...props}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" /></svg>);

interface Flight { from: string; to: string; date: Date | null; }

// New AirportInput component with autofill
const AirportInput: FC<{ value: string; onSelect: (code: string) => void; placeholder: string; }> = ({ value, onSelect, placeholder }) => {
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState<Airport[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setSuggestions([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setInputValue(query);
        if (query.length > 1) {
            const filtered = airports.filter(airport =>
                airport.code.toLowerCase().includes(query.toLowerCase()) ||
                airport.city.toLowerCase().includes(query.toLowerCase()) ||
                airport.name.toLowerCase().includes(query.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (airport: Airport) => {
        setInputValue(`${airport.city} (${airport.code})`);
        onSelect(airport.code);
        setSuggestions([]);
    };

    return (
        <div className="relative flex-1" ref={containerRef}>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="w-full border rounded-lg px-4 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 h-14 text-lg"
                autoComplete="off"
            />
            {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg mt-1 shadow-lg">
                    {suggestions.map(airport => (
                        <li key={airport.code}>
                            <button
                                type="button"
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => handleSuggestionClick(airport)}
                            >
                                <span className="font-bold">{airport.city}</span> ({airport.code}) - {airport.name}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


const FlightRow: FC<{ flight: Flight; index: number; onFlightChange: (index: number, newFlight: Flight) => void; onRemoveFlight?: (index: number) => void; isRemovable: boolean; }> = ({ flight, index, onFlightChange, onRemoveFlight, isRemovable }) => {
    const handleFieldChange = (field: keyof Flight, value: string | Date | null) => {
        onFlightChange(index, { ...flight, [field]: value });
    };

    return (
        <div className="flex md:flex-row md:items-end md:space-x-4 mb-2">
            <div className="flex-1 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <AirportInput value={flight.from} onSelect={(code) => handleFieldChange('from', code)} placeholder="Origin" />
                <AirportInput value={flight.to} onSelect={(code) => handleFieldChange('to', code)} placeholder="Destination" />
                <div className="flex-1">
                    <ReactDatePicker
                        selected={flight.date}
                        onChange={(date: Date | null) => handleFieldChange('date', date)}
                        className="w-full border rounded-lg px-4 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 h-14 text-lg"
                        placeholderText="MM/DD/YYYY"
                        dateFormat="MM/dd/yyyy"
                    />
                </div>
            </div>
            <div className="w-9 h-14 flex-shrink-0 flex justify-center items-center">
                {isRemovable && (<button type="button" onClick={() => onRemoveFlight(index)} className="text-gray-500 hover:text-red-500" aria-label="Remove flight"><XIcon /></button>)}
            </div>
        </div>
    );
};

const SearchResults: FC<{ results: { title: string; flights: Route[] }[] }> = ({ results }) => {
    const hasResults = results.some(r => r.flights.length > 0);

    if (!hasResults) {
        return <div className="text-center py-8 text-gray-500">No flights found for this route.</div>;
    }

    return (
        <div className="mt-6 space-y-6">
            {results.map((result, index) => (
                result.flights.length > 0 && (
                    <div key={index}>
                        <h3 className="text-lg font-semibold mb-2">{result.title}</h3>
                        <div className="space-y-4">
                            {result.flights.map((route, idx) => (
                                <div key={idx} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center">
                                    <div><span className="font-bold">{route.origin}</span> → <span className="font-bold">{route.destination}</span></div>
                                    <div className="text-lg font-semibold text-primary dark:text-primary-dark">{route.miles.toLocaleString()} miles</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            ))}
        </div>
    );
};

// --- SHARED SEARCH BAR COMPONENT ---

interface SearchBarProps {
  tripType: string;
  setTripType: (v: string) => void;
  passengers: { adults: number; children: number };
  setPassengers: (v: { adults: number; children: number }) => void;
  fareClass: string;
  setFareClass: (v: string) => void;
  flights: Flight[];
  setFlights: (v: Flight[]) => void;
  onSearch: () => void;
  isSearchDisabled: boolean;
  openDropdown: string | null;
  setOpenDropdown: (v: string | null) => void;
  handleDropdownToggle: (name: string) => void;
  handleTripTypeChange: (v: string) => void;
  handlePassengersChange: (v: { adults: number; children: number }) => void;
  handleFareClassChange: (v: string) => void;
  handleFlightChange: (index: number, newFlight: Flight) => void;
  addFlight: () => void;
  removeFlight: (index: number) => void;
}

const SearchBar: FC<SearchBarProps> = (props) => {
  const {
    tripType, setTripType, passengers, setPassengers, fareClass, setFareClass, flights, setFlights,
    onSearch, isSearchDisabled, openDropdown, setOpenDropdown, handleDropdownToggle,
    handleTripTypeChange, handlePassengersChange, handleFareClassChange, handleFlightChange, addFlight, removeFlight
  } = props;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 relative">
      <div className="flex gap-4 mb-6">
        <TripTypeDropdown value={tripType} onChange={handleTripTypeChange} isOpen={openDropdown === 'tripType'} onToggle={() => handleDropdownToggle('tripType')} className="flex-1" />
        <PeopleDropdown value={passengers} onChange={handlePassengersChange} isOpen={openDropdown === 'people'} onToggle={() => handleDropdownToggle('people')} onDone={() => setOpenDropdown(null)} className="flex-1" />
        <FareClassDropdown value={fareClass} onChange={handleFareClassChange} isOpen={openDropdown === 'fareClass'} onToggle={() => handleDropdownToggle('fareClass')} className="flex-1" />
       </div>
      <form onSubmit={e => { e.preventDefault(); onSearch(); }}>
        {tripType === 'oneway' && (<FlightRow flight={flights[0]} index={0} onFlightChange={handleFlightChange} isRemovable={false} />)}
        {tripType === 'roundtrip' && (<div><FlightRow flight={flights[0]} index={0} onFlightChange={handleFlightChange} isRemovable={false} /><FlightRow flight={flights[1]} index={1} onFlightChange={handleFlightChange} isRemovable={false} /></div>)}
        {tripType === 'multicity' && (<>{flights.map((flight, index) => (<FlightRow key={index} flight={flight} index={index} onFlightChange={handleFlightChange} onRemoveFlight={removeFlight} isRemovable={index > 1}/>))}<div className="flex justify-start ml-2"><button type="button" onClick={addFlight} className="mt-2 text-sm text-primary dark:text-primary-dark font-semibold hover:underline">+ Add Flight</button></div></>)}
        <div className="flex justify-center mt-6">
          <button type="submit" disabled={isSearchDisabled} className="bg-primary text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-dark">Search</button>
        </div>
      </form>
    </div>
  );
};

export default function HomePage() {
  const [tripType, setTripType] = useState('oneway');
  const [passengers, setPassengers] = useState({ adults: 1, children: 0 });
  const [fareClass, setFareClass] = useState('economy');
  const [flights, setFlights] = useState<Flight[]>([
    { from: '', to: '', date: null }, { from: '', to: '', date: null },
  ]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<{ title: string; flights: Route[] }[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();

  const handleDropdownToggle = (name: string) => setOpenDropdown(prev => (prev === name ? null : name));
  const handleTripTypeChange = (value: string) => { setTripType(value); setOpenDropdown(null); };
  const handlePassengersChange = (value: { adults: number; children: number }) => setPassengers(value);
  const handleFareClassChange = (value: string) => { setFareClass(value); setOpenDropdown(null); };
  const handleFlightChange = (index: number, newFlight: Flight) => {
    const updated = [...flights]; updated[index] = newFlight;
    if (tripType === 'roundtrip' && index === 0) {
        updated[1] = { ...updated[1], from: newFlight.to, to: newFlight.from };
    }
    setFlights(updated);
  };
  const addFlight = () => setFlights([...flights, { from: '', to: '', date: null }]);
  const removeFlight = (index: number) => setFlights(flights.filter((_, i) => i !== index));

  const onSearch = () => {
    // Build query params
    const params = new URLSearchParams();
    params.set('tripType', tripType);
    params.set('adults', String(passengers.adults));
    params.set('children', String(passengers.children));
    params.set('fareClass', fareClass);
    flights.forEach((flight, i) => {
      params.set(`from${i}`, flight.from);
      params.set(`to${i}`, flight.to);
      params.set(`date${i}`, flight.date ? flight.date.toISOString().split('T')[0] : '');
    });
    router.push(`/results?${params.toString()}`);
  };
  
  const isSearchDisabled = flights[0].from === '' || flights[0].to === '';

  return (
    <section className="mt-8 space-y-4 relative">
      <SearchBar
        tripType={tripType}
        setTripType={setTripType}
        passengers={passengers}
        setPassengers={setPassengers}
        fareClass={fareClass}
        setFareClass={setFareClass}
        flights={flights}
        setFlights={setFlights}
        onSearch={onSearch}
        isSearchDisabled={isSearchDisabled}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        handleDropdownToggle={handleDropdownToggle}
        handleTripTypeChange={handleTripTypeChange}
        handlePassengersChange={handlePassengersChange}
        handleFareClassChange={handleFareClassChange}
        handleFlightChange={handleFlightChange}
        addFlight={addFlight}
        removeFlight={removeFlight}
      />
      {hasSearched && <SearchResults results={searchResults} />}
      <div className="mt-8"> <MapPlaceholder /> </div>
    </section>
  );
}