"use client";

import { useState, useEffect } from 'react';
import MapPlaceholder from './MapPlaceholder';
import TripTypeDropdown from './TripTypeDropdown';
import PeopleDropdown from './PeopleDropdown';
import FareClassDropdown from './FareClassDropdown';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const tripTypes = [
  { label: 'One-way', value: 'oneway' },
  { label: 'Round-trip', value: 'roundtrip' },
  { label: 'Multi-city', value: 'multicity' },
];

const fareClasses = [
    { label: 'Economy', value: 'economy' },
    { label: 'Premium Economy', value: 'premium_economy' },
    { label: 'Business', value: 'business' },
    { label: 'First', value: 'first' },
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
          <TripTypeDropdown selected={tripType} onSelect={setTripType} types={tripTypes} />
          <PeopleDropdown selected={people} onSelect={setPeople} />
          <FareClassDropdown selected={fareClass} onSelect={setFareClass} classes={fareClasses} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
          {/* Origin Input */}
          <div className="lg:col-span-3">
            <input
              type="text"
              placeholder="From"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <input
              type="text"
              placeholder="To"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date Pickers */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ReactDatePicker
                selected={departureDate}
                onChange={(date) => setDepartureDate(date)}
                selectsStart
                startDate={departureDate}
                endDate={returnDate}
                placeholderText="Departure"
                className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
