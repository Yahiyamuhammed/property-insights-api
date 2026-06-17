import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch, isLoading }) {
  const [pin, setPin] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.trim().length >= 10) {
      onSearch(pin.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative flex items-center">
        <Search className="absolute left-4 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Enter Cook County PIN (e.g., 17351080170000)"
          className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-lg bg-white"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || pin.trim().length < 10}
          className="absolute right-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
}