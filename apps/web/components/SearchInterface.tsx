"use client";

import { useState, useEffect, useRef } from 'react';
import MapPlaceholder from './MapPlaceholder';
import TripTypeDropdown from './TripTypeDropdown';
import PeopleDropdown from './PeopleDropdown';
import FareClassDropdown from './FareClassDropdown';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AirportAutocomplete from './AirportAutocomplete';

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

/**
 * Props for the SearchInterface component, allowing for initial state to be passed.
 * This is used on the search results page to pre-fill the form.
 */
interface SearchInterfaceProps {
  initialSearchParams?: {
    from?: string;
    to?: string;
    depart?: string;
    return?: string;
    tripType?: string;
    adults?: string;
    children?: string;
    infants?: string;
    fareClass?: string;
  };
}

// Helper for a close (X) icon
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" /></svg>
  );
}

/**
 * A reusable component that encapsulates the entire flight search UI.
 * It can be initialized with search parameters.
 */
export default function SearchInterface({ initialSearchParams }: SearchInterfaceProps) {
  // --- STATE MANAGEMENT ---
  // Each piece of the form state is managed here.
  // It's initialized either from the `initialSearchParams` prop or with default values.

  const [tripType, setTripType] = useState(
    tripTypes.find(t => t.value === initialSearchParams?.tripType) || tripTypes[0]
  );
  const [people, setPeople] = useState({
    adults: parseInt(initialSearchParams?.adults || '1', 10),
    children: parseInt(initialSearchParams?.children || '0', 10),
    infants: parseInt(initialSearchParams?.infants || '0', 10),
  });
  const [fareClass, setFareClass] = useState(
    fareClasses.find(f => f.value === initialSearchParams?.fareClass) || fareClasses[0]
  );

  const [origin, setOrigin] = useState(initialSearchParams?.from || '');
  const [destination, setDestination] = useState(initialSearchParams?.to || '');

  const [departureDate, setDepartureDate] = useState<Date | null>(
    initialSearchParams?.depart ? new Date(initialSearchParams.depart) : new Date()
  );
  const [returnDate, setReturnDate] = useState<Date | null>(
    initialSearchParams?.return ? new Date(initialSearchParams.return) : null
  );

  // Add this state to control which dropdown is open
  const [openDropdown, setOpenDropdown] = useState<null | "tripType" | "people" | "fareClass">(null);

  // Ref for the dropdown area
  const dropdownsRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!openDropdown) return;
    function handleClick(event: MouseEvent) {
      if (dropdownsRef.current && !dropdownsRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openDropdown]);

  // Multi-city segments state
  const [segments, setSegments] = useState([
    { from: '', to: '', date: null },
    { from: '', to: '', date: null },
  ]);

  // Handlers for multi-city
  const handleSegmentChange = (idx: number, field: 'from' | 'to' | 'date', value: string | Date | null) => {
    setSegments(segs => segs.map((seg, i) => i === idx ? { ...seg, [field]: value } : seg));
  };
  const handleAddSegment = () => {
    setSegments(segs => [...segs, { from: '', to: '', date: null }]);
  };
  const handleRemoveSegment = (idx: number) => {
    setSegments(segs => segs.length > 2 ? segs.filter((_, i) => i !== idx) : segs);
  };

  // Reset segments if tripType changes away from multicity
  useEffect(() => {
    if (tripType.value !== 'multicity') {
      setSegments([
        { from: '', to: '', date: null },
        { from: '', to: '', date: null },
      ]);
    }
  }, [tripType.value]);

  /**
   * Handles the search button click.
   * It constructs a URL with all the form data as query parameters
   * and opens this URL in a new browser tab.
   */
  const handleSearch = () => {
    const params = new URLSearchParams();

    // Add all form fields to the search parameters
    if (origin) params.set('from', origin);
    if (destination) params.set('to', destination);
    if (departureDate) params.set('depart', departureDate.toISOString().split('T')[0]);
    if (returnDate && tripType.value === 'roundtrip') {
      params.set('return', returnDate.toISOString().split('T')[0]);
    }
    params.set('tripType', tripType.value);
    params.set('adults', people.adults.toString());
    params.set('children', people.children.toString());
    params.set('infants', people.infants.toString());
    params.set('fareClass', fareClass.value);

    // Construct the final URL and open it in a new tab
    const searchUrl = `/search?${params.toString()}`;
    window.open(searchUrl, '_blank');
  };
  
  // Swaps the origin and destination fields
  const handleSwapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="flex flex-wrap gap-4 mb-4">
          <div ref={dropdownsRef} className="flex gap-4">
            <TripTypeDropdown
              selected={tripType}
              onSelect={setTripType}
              types={tripTypes}
              isOpen={openDropdown === "tripType"}
              onToggle={() => setOpenDropdown(openDropdown === "tripType" ? null : "tripType")}
            />
            <PeopleDropdown
              selected={people}
              onSelect={setPeople}
              isOpen={openDropdown === "people"}
              onToggle={() => setOpenDropdown(openDropdown === "people" ? null : "people")}
            />
            <FareClassDropdown
              selected={fareClass}
              onSelect={setFareClass}
              classes={fareClasses}
              isOpen={openDropdown === "fareClass"}
              onToggle={() => setOpenDropdown(openDropdown === "fareClass" ? null : "fareClass")}
            />
          </div>
        </div>

        {/* Multi-city dynamic segments */}
        {tripType.value === 'multicity' ? (
          <div className="space-y-4">
            {segments.map((seg, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <AirportAutocomplete
                  value={seg.from}
                  onChange={val => handleSegmentChange(idx, 'from', val)}
                  placeholder="From"
                  className="flex-1"
                />
                <AirportAutocomplete
                  value={seg.to}
                  onChange={val => handleSegmentChange(idx, 'to', val)}
                  placeholder="To"
                  className="flex-1"
                />
                <div className="relative w-full">
                  <ReactDatePicker
                    selected={seg.date}
                    onChange={date => handleSegmentChange(idx, 'date', date)}
                    placeholderText="Date"
                    className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {segments.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSegment(idx)}
                    className="ml-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                    aria-label="Remove city"
                  >
                    <XIcon className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSegment}
              className="mt-2 text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              + Add city
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
            {/* Origin Input */}
            <div className="lg:col-span-3">
              <AirportAutocomplete
                value={origin}
                onChange={setOrigin}
                placeholder="From"
                className="w-full"
              />
            </div>

            {/* Swap Button */}
            <div className="lg:col-span-1 text-center">
               <button onClick={handleSwapAirports} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              </button>
            </div>

            {/* Destination Input */}
            <div className="lg:col-span-3">
              <AirportAutocomplete
                value={destination}
                onChange={setDestination}
                placeholder="To"
                className="w-full"
              />
            </div>

            {/* Date Pickers */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative w-full">
                  <ReactDatePicker
                    selected={departureDate}
                    onChange={(date) => setDepartureDate(date)}
                    selectsStart
                    startDate={departureDate}
                    endDate={returnDate}
                    placeholderText="Departure"
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative w-full">
                  <ReactDatePicker
                    selected={returnDate}
                    onChange={(date) => setReturnDate(date)}
                    selectsEnd
                    startDate={departureDate}
                    endDate={returnDate}
                    minDate={departureDate}
                    placeholderText="Return"
                    disabled={tripType.value !== 'roundtrip'}
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>
            </div>
          </div>
        )}
        
        <div className="mt-6">
          <button
            onClick={handleSearch}
            className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
            Search
          </button>
        </div>
      </div>
    </div>
  );
}