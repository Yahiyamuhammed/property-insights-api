import { Database, Building2, User, Scale, CircleDollarSign, HardHat, MapPin, LineChart } from 'lucide-react';

export default function Dashboard({ data }) {
  if (!data) return null;

  const { parcelId, tabs } = data;

  const getTabConfig = (modeCode) => {
    const configs = {
        'profileall_cc': { name: 'General Profile', icon: Building2 },
        'maildetail': { name: 'Taxpayer Details', icon: User },
        'full_legal_cd': { name: 'Legal Description', icon: Scale },
        'sales': { name: 'Sales History', icon: CircleDollarSign },
        'permit_ck_cc': { name: 'Building Permits', icon: HardHat },
        'value_summary_cc': { name: 'Valuation History', icon: LineChart }
    };
    return configs[modeCode] || { name: modeCode, icon: Database };
  };

  const renderKeyValuePair = (label, value) => (
    <div key={label} className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-3 border-b border-slate-100 items-start text-sm last:border-0">
      <span className="text-slate-500 font-medium sm:pt-0.5">{label}</span>
      <span className="sm:col-span-2 text-slate-900 font-semibold break-words">{value}</span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Banner */}
      <div className="bg-slate-950 text-slate-50 p-8 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center border border-slate-800 gap-4">
        <div>
           <p className="text-slate-400 text-sm font-semibold tracking-widest uppercase mb-1">Cook County Parcel</p>
           <h2 className="text-3xl font-bold font-mono tracking-tight">{parcelId}</h2>
           <div className="flex items-center gap-2 mt-3 text-slate-300">
             <MapPin className="w-4 h-4" />
             <p className="text-sm font-medium">
               {tabs.profileall_cc?.['Property Address'] || 'Address Unknown'} • {tabs.profileall_cc?.['City & Zip Code']}
             </p>
           </div>
        </div>
        {tabs.profileall_cc?.['Class']?.includes('EX') && (
            <span className="px-4 py-2 bg-slate-800 text-slate-200 rounded-lg border border-slate-700 font-semibold tracking-wide text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                Exempt Property
            </span>
        )}
      </div>

      {/* Dynamic Data Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {Object.entries(tabs).map(([modeName, fields]) => {
          const { name: TabName, icon: TabIcon } = getTabConfig(modeName);
          
          // If the data is an array (like Valuation History), we want the card to span both columns
          const isTable = Array.isArray(fields);

          return (
            <div 
              key={modeName} 
              className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col ${isTable ? 'col-span-1 lg:col-span-2' : ''}`}
            >
              
              {/* Card Header */}
              <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-3">
                <div className="p-2 bg-white rounded-md border border-slate-200 shadow-sm">
                  <TabIcon className="w-5 h-5 text-slate-700" />
                </div>
                <h3 className="font-semibold text-slate-900 tracking-tight">{TabName}</h3>
              </div>
              
              {/* Card Body */}
              <div className="flex-1">
                {isTable ? (
                  // HORIZONTAL TABLE RENDERER
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left text-sm min-w-max">
                      <thead className="bg-slate-100 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                        <tr>
                          {Object.keys(fields[0] || {}).map((headerKey) => (
                            <th key={headerKey} className="px-5 py-4 border-b border-slate-200 whitespace-nowrap">
                              {headerKey}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {fields.map((row, rowIndex) => (
                          <tr key={rowIndex} className="hover:bg-slate-50 transition-colors">
                            {Object.values(row).map((cellValue, cellIndex) => (
                              <td key={cellIndex} className="px-5 py-3 text-slate-800 whitespace-nowrap font-medium">
                                {cellValue}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  // KEY-VALUE RENDERER
                  <div className="flex flex-col p-6">
                    {Object.entries(fields).map(([label, value]) => 
                      renderKeyValuePair(label, value)
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}