import { useState } from 'react';
import { apiClient } from './api/client';
import SearchBar from './components/SearchBar';
import Dashboard from './components/Dashboard';

export default function App() {
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (pin) => {
    setLoading(true);
    setError('');
    setPropertyData(null);
    
    try {
      const response = await apiClient.get(`/property/${pin}`);
      if (response.data.success) {
        setPropertyData(response.data.data);
      } else {
        setError(response.data.message || 'Property not found.');
      }
    } catch (err) {
      setError(`Failed to connect to the API Gateway. Ensure backend is running.${err}`);

      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      
      {/* Minimalist Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-950 rounded flex items-center justify-center">
              <span className="text-white font-bold font-mono text-xs">API</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Stateless Gateway</h1>
          </div>
          <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Cook County Prototype
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 pt-12 pb-24">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Property Intelligence
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Bypass legacy architecture. Enter a PIN to instantly aggregate normalized data across multiple assessment vectors.
          </p>
        </div>

        <SearchBar onSearch={handleSearch} isLoading={loading} />
        
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center font-medium shadow-sm">
            {error}
          </div>
        )}
        
        <Dashboard data={propertyData} />
      </main>
    </div>
  );
}