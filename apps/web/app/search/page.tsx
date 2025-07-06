"use client";

import { useSearchParams } from 'next/navigation';
import SearchInterface from '../../components/SearchInterface';
import { Suspense } from 'react';

/**
 * This is the content of the search page. It's wrapped in a Suspense boundary
 * because useSearchParams can suspend rendering while the parameters are being read.
 */
function SearchResults() {
    const searchParams = useSearchParams();
    
    // Create an object from the URL's search parameters.
    // This will be passed as props to the SearchInterface to pre-fill the form fields.
    const initialSearchParams = {
        from: searchParams.get('from') || undefined,
        to: searchParams.get('to') || undefined,
        depart: searchParams.get('depart') || undefined,
        return: searchParams.get('return') || undefined,
        tripType: searchParams.get('tripType') || undefined,
        adults: searchParams.get('adults') || undefined,
        children: searchParams.get('children') || undefined,
        infants: searchParams.get('infants') || undefined,
        fareClass: searchParams.get('fareClass') || undefined,
    };

    return (
        <div className="space-y-8">
            {/* The search form is displayed at the top, pre-filled with the user's search */}
            <SearchInterface initialSearchParams={initialSearchParams} />
            
            {/* This section will eventually hold the flight results */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Search Results</h2>
                <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                    <p className="text-gray-500 dark:text-gray-400">
                        Showing results for flights from <strong>{initialSearchParams.from || 'anywhere'}</strong> to <strong>{initialSearchParams.to || 'anywhere'}</strong>.
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Your flight results will appear here.
                    </p>
                </div>
            </div>
        </div>
    );
}

/**
 * The main export for the /search route.
 * It uses Suspense as a wrapper, which is a best practice when using useSearchParams.
 */
export default function SearchPage() {
    return (
        <Suspense fallback={<div className="text-center p-8">Loading search...</div>}>
            <SearchResults />
        </Suspense>
    );
}
