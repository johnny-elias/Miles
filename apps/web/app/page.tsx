import SearchInterface from '../components/SearchInterface';
import MapPlaceholder from '../components/MapPlaceholder';

/**
 * This is the main home page component for the application.
 * It renders the primary search interface and the map placeholder below it.
 * The logic for handling search input and opening the results in a new tab
 * is encapsulated within the SearchInterface component.
 */
export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* The SearchInterface on the home page doesn't need any initial params.
        It will handle opening the search results in a new tab itself.
      */}
      <SearchInterface />

      {/* The map placeholder is still displayed on the home page */}
      <MapPlaceholder />
    </div>
  );
}
