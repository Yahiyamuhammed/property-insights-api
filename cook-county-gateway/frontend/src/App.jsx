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
      setError('Failed to connect to the Gateway. Ensure the backend server is running on port 3000.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-gray-200 py-6 mb-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Stateless GovTech API Gateway</h1>
          <p className="text-gray-500 mt-1 text-sm">Cook County Integration Prototype</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-20">
        <SearchBar onSearch={handleSearch} isLoading={loading} />
        
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}
        
        <Dashboard data={propertyData} />
      </main>
    </div>
  );
}