import { MapPin, User, DollarSign } from 'lucide-react';

export default function Dashboard({ data }) {
  if (!data) return null;

  // Assuming the backend sends data structured like the JSON schema we discussed
  const { meta, taxpayer, latestSale, parcelId } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
      
      {/* Property Overview Card (Spans full width) */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm col-span-1 md:col-span-2">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-wider">Property Location</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{meta?.address || 'Address Unknown'}</h2>
            <p className="text-gray-600 mt-1">
              {meta?.city || 'City Unknown'} • Neighborhood: {meta?.neighborhood || 'N/A'}
            </p>
          </div>
          <div className="text-left md:text-right">
            <span className="inline-block px-3 py-1 bg-slate-100 text-slate-800 rounded-md text-sm font-mono border border-slate-200">
              PIN: {parcelId}
            </span>
            {meta?.isExempt && (
              <span className="block mt-3 px-3 py-1 bg-amber-50 text-amber-700 rounded-md text-sm font-medium border border-amber-200">
                Tax Exempt Property
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Taxpayer Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 text-gray-500 mb-4 border-b border-gray-100 pb-3">
          <User className="w-4 h-4" />
          <h3 className="font-semibold uppercase tracking-wider text-sm">Taxpayer Record</h3>
        </div>
        <p className="text-lg font-medium text-gray-900">{taxpayer?.name || 'Not Available'}</p>
        <p className="text-sm text-gray-500 mt-2">Tax Year: {meta?.taxYear || 'Current'}</p>
      </div>

      {/* Latest Sale Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 text-gray-500 mb-4 border-b border-gray-100 pb-3">
          <DollarSign className="w-4 h-4" />
          <h3 className="font-semibold uppercase tracking-wider text-sm">Latest Transaction</h3>
        </div>
        {latestSale && latestSale.price ? (
          <>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              ${Number(latestSale.price).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mb-4">Recorded: {latestSale.date || 'N/A'}</p>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Buyer:</span> {latestSale.buyer || 'N/A'}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <span className="font-semibold text-gray-900">Type:</span> {latestSale.type || 'N/A'}
              </p>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center py-6">
            <p className="text-gray-400 italic">No recent sales data found.</p>
          </div>
        )}
      </div>

    </div>
  );
}