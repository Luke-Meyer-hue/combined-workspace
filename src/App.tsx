import React, { useState } from 'react';
import { Calendar, Search, Package } from 'lucide-react';
import CalendarSection from './components/CalendarSection';
import SearchSection from './components/SearchSection';
import BlankSection from './components/BlankSection';

function App() {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const sections = [
    { id: 0, title: 'Calendar', icon: Calendar, component: CalendarSection },
    { id: 1, title: 'Search', icon: Search, component: SearchSection },
    { id: 2, title: 'Workspace', icon: Package, component: BlankSection }
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {expandedSection === null ? (
          <div className="flex flex-col gap-6">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <div
                  key={section.id}
                  onClick={() => setExpandedSection(index)}
                  className="w-full aspect-square bg-blue-500 text-white flex flex-col 
                             items-center justify-center rounded-xl shadow-lg 
                             cursor-pointer hover:bg-blue-600 transition"
                >
                  <IconComponent size={40} />
                  <h2 className="text-xl font-semibold mt-4">{section.title}</h2>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-300 shadow-md p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">{sections[expandedSection].title}</h2>
              <button
                onClick={() => setExpandedSection(null)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Back
              </button>
            </div>
            {React.createElement(sections[expandedSection].component)}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
