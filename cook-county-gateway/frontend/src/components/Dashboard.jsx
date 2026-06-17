import { Database } from 'lucide-react';

export default function Dashboard({ data }) {
  if (!data) return null;

  const { parcelId, tabs } = data;

  // A helper to make the internal tab names look pretty on the UI
  const formatTabName = (modeCode) => {
    const names = {
        'profileall_cc': 'General Profile',
        'maildetail': 'Taxpayer Details',
        'full_legal_cd': 'Legal Description',
        'sales': 'Sales History',
        'permit_ck_cc': 'Building Permits'
    };
    return names[modeCode] || modeCode;
  };

  return (
    <div className="max-w-5xl mx-auto w-full space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold">Property PIN: {parcelId}</h2>
           <p className="text-slate-400 mt-1">
             {tabs.profileall_cc?.['Property Address'] || 'Address Unknown'} • {tabs.profileall_cc?.['City & Zip Code']}
           </p>
        </div>
        {tabs.profileall_cc?.['Class']?.includes('EX') && (
            <span className="px-4 py-2 bg-amber-500/20 text-amber-300 rounded-md border border-amber-500/30 font-medium">
                Exempt Property
            </span>
        )}
      </div>

      {/* Dynamic Data Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(tabs).map(([modeName, fields]) => (
          
          <div key={modeName} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 border-b border-gray-100 pb-4 mb-4">
              <Database className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-lg text-gray-900">{formatTabName(modeName)}</h3>
            </div>
            
            <div className="space-y-3">
              {Object.entries(fields).map(([label, value]) => (
                <div key={label} className="grid grid-cols-3 gap-4 text-sm">
                  <span className="col-span-1 text-gray-500 font-medium">{label}</span>
                  <span className="col-span-2 text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

        ))}
      </div>

    </div>
  );
}