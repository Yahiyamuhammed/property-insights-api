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
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-10">
      <div className="relative flex items-center group">
        <Search className="absolute left-5 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-slate-900" />
        <input
          type="text"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Enter Cook County PIN (e.g., 17351080170000)"
          className="w-full pl-14 pr-32 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent shadow-sm text-lg bg-white transition-all placeholder:text-slate-400 text-slate-900 font-medium"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || pin.trim().length < 10}
          className="absolute right-2 top-2 bottom-2 px-6 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 transition-colors font-semibold tracking-wide"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
}