import SearchInterface from '../components/SearchInterface';

/**
 * This is the main home page component for the application.
 * It renders the primary search interface and the map placeholder below it.
 * The logic for handling search input and opening the results in a new tab
 * is encapsulated within the SearchInterface component.
 */
export default function HomePage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      {/* The SearchInterface on the home page doesn't need any initial params.
        It will handle opening the search results in a new tab itself.
      */}
      <SearchInterface />

      {/* The map placeholder is still displayed on the home page */}
      <div className="w-full h-80 border-2 border-dotted border-gray-400 rounded-xl flex items-center justify-center text-gray-500 text-xl">
        Map Placeholder
      </div>
    </div>
  );
}
