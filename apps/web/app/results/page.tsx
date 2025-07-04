"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import SearchBar from '../page'; // Import the SearchBar and related types from the home page

// Reuse the mock data and search logic from page.tsx
// (You may want to refactor this into a shared file for production)

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse query params
  const tripType = searchParams.get('tripType') || 'oneway';
  const adults = Number(searchParams.get('adults') || 1);
  const children = Number(searchParams.get('children') || 0);
  const fareClass = searchParams.get('fareClass') || 'economy';
  const flights = [];
  for (let i = 0; i < 4; i++) {
    const from = searchParams.get(`from${i}`) || '';
    const to = searchParams.get(`to${i}`) || '';
    const dateStr = searchParams.get(`date${i}`) || '';
    if (from || to || dateStr) {
      flights.push({ from, to, date: dateStr ? new Date(dateStr) : null });
    }
  }

  // You would use the same mock search logic as in page.tsx to get results
  // For now, just show the parsed params and a placeholder

  return (
    <div className="p-8">
      {/* Search bar at the top (pre-filled) */}
      <div className="mb-8">
        <SearchBar
          tripType={tripType}
          setTripType={() => {}}
          passengers={{ adults, children }}
          setPassengers={() => {}}
          fareClass={fareClass}
          setFareClass={() => {}}
          flights={flights}
          setFlights={() => {}}
          onSearch={() => {}}
          isSearchDisabled={false}
          openDropdown={null}
          setOpenDropdown={() => {}}
          handleDropdownToggle={() => {}}
          handleTripTypeChange={() => {}}
          handlePassengersChange={() => {}}
          handleFareClassChange={() => {}}
          handleFlightChange={() => {}}
          addFlight={() => {}}
          removeFlight={() => {}}
        />
      </div>
      {/* Results below */}
      <div>
        <div className="text-lg font-semibold mb-4">Showing results for:</div>
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm overflow-x-auto">{JSON.stringify({ tripType, adults, children, fareClass, flights }, null, 2)}</pre>
        <div className="mt-8 text-gray-500">[Mock search results would appear here]</div>
      </div>
    </div>
  );
} 