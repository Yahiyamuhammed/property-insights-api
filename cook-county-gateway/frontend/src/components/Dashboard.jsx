import { MapPin, User, DollarSign, FileText } from 'lucide-react';

export default function Dashboard({ data }) {
  if (!data) return null;

  const { meta, taxpayer, latestSale, parcelId } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
      
      {/* Upgraded Property Overview Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm col-span-1 md:col-span-2">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-gray-100 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-wider">Property Location</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{meta?.address || 'Address Unknown'}</h2>
            <p className="text-gray-600 mt-1">
              {meta?.city || 'City Unknown'} • {meta?.propertyClass}
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

        {/* New Extended Data Grid */}
        <div>
          <div className="flex items-center gap-2 text-gray-500 mb-4">
            <FileText className="w-4 h-4" />
            <h3 className="font-semibold uppercase tracking-wider text-sm">Extended Profile Data</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
            <DataPoint label="Tax / Pay Year" value={`${meta?.taxYear} / ${meta?.payYear}`} />
            <DataPoint label="Neighborhood" value={meta?.neighborhood} />
            <DataPoint label="Tax District" value={meta?.taxDistrict} />
            <DataPoint label="Town Name" value={meta?.townName} />
            <DataPoint label="Tri-Town" value={meta?.triTown} />
            <DataPoint label="Multiple Addresses" value={meta?.multipleAddresses} />
            <DataPoint label="Building/Unit" value={meta?.buildingUnit || 'None'} />
            <DataPoint label="Key PIN" value={meta?.keyPin} />
          </div>
        </div>
      </div>

      {/* Taxpayer Card (Keep your existing code here) */}
      {/* ... */}

      {/* Latest Sale Card (Keep your existing code here) */}
      {/* ... */}

    </div>
  );
}

// A clean, reusable sub-component for your data grid
function DataPoint({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{label}</span>
      <span className="text-sm text-gray-900 font-medium">{value && value !== '----' ? value : 'N/A'}</span>
    </div>
  );
}