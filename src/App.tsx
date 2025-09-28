import React, { useState, useEffect } from 'react';
import { Calendar, Search, Package } from 'lucide-react';
import CalendarSection from './components/CalendarSection';
import SearchSection from './components/SearchSection';
import BlankSection from './components/BlankSection';

function App() {
  const [selectedSection, setSelectedSection] = useState(0);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const sections = [
    { id: 0, title: 'Calendar', icon: Calendar, component: CalendarSection },
    { id: 1, title: 'Search', icon: Search, component: SearchSection },
    { id: 2, title: 'Workspace', icon: Package, component: BlankSection }
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keys if we're typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'w':
          e.preventDefault();
          if (expandedSection === null) {
            setSelectedSection(prev => Math.max(0, prev - 1));
          }
          break;
        case 's':
          e.preventDefault();
          if (expandedSection === null) {
            setSelectedSection(prev => Math.min(sections.length - 1, prev + 1));
          }
          break;
        case 'a':
          e.preventDefault();
          if (expandedSection === null) {
            setSelectedSection(prev => Math.max(0, prev - 1));
          }
          break;
        case 'd':
          e.preventDefault();
          if (expandedSection === null) {
            setSelectedSection(prev => Math.min(sections.length - 1, prev + 1));
          }
          break;
        case 'enter':
          e.preventDefault();
          if (expandedSection === null) {
            setExpandedSection(selectedSection);
          }
          break;
        case 'escape':
          e.preventDefault();
          setExpandedSection(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSection, expandedSection, sections.length]);

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <div className="text-sm text-gray-400">
            {expandedSection === null ? (
              <>
                <span className="text-purple-400">WASD</span> to navigate • 
                <span className="text-blue-400 ml-1">Enter</span> to expand
              </>
            ) : (
              <span className="text-green-400">Esc to return</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-screen pt-20 pb-6 px-6">
        {expandedSection === null ? (
          // Overview Layout
          <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-6">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              const isSelected = selectedSection === index;
              
              return (
                <div
                  key={section.id}
                  className={`
                    relative rounded-2xl border transition-all duration-500 ease-out
                    transform hover:scale-105 cursor-pointer group overflow-hidden
                    ${isSelected 
                      ? 'border-purple-400 bg-gray-800/50 shadow-2xl shadow-purple-500/25 scale-105' 
                      : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                    }
                  `}
                  onClick={() => {
                    setSelectedSection(index);
                    setExpandedSection(index);
                  }}
                >
                  {/* Background gradient */}
                  <div className={`
                    absolute inset-0 opacity-0 transition-opacity duration-500
                    bg-gradient-to-br from-purple-500/10 to-blue-500/10
                    ${isSelected ? 'opacity-100' : 'group-hover:opacity-50'}
                  `} />
                  
                  {/* Content */}
                  <div className="relative h-full p-8 flex flex-col items-center justify-center text-center">
                    <div className={`
                      mb-6 p-4 rounded-full transition-all duration-300
                      ${isSelected 
                        ? 'bg-purple-500/20 text-purple-300' 
                        : 'bg-gray-700/50 text-gray-400 group-hover:bg-gray-600/50 group-hover:text-gray-300'
                      }
                    `}>
                      <IconComponent size={32} />
                    </div>
                    
                    <h2 className={`
                      text-xl font-semibold mb-2 transition-colors duration-300
                      ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}
                    `}>
                      {section.title}
                    </h2>
                    
                    <p className="text-gray-500 text-sm">
                      {section.id === 0 && "Plan your schedule and manage events"}
                      {section.id === 1 && "Search the web and navigate to any site"}
                      {section.id === 2 && "Your personalized workspace"}
                    </p>
                    
                    {isSelected && (
                      <div className="mt-4 text-xs text-purple-300 animate-pulse">
                        Press Enter to expand
                      </div>
                    )}
                  </div>

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute inset-0 rounded-2xl border-2 border-purple-400 pointer-events-none">
                      <div className="absolute -top-1 -left-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
                      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // Expanded Layout
          <div className="h-full">
            <div className="h-full rounded-2xl border border-gray-700 bg-gray-800/50 overflow-hidden">
              {/* Expanded Section Header */}
              <div className="px-6 py-4 border-b border-gray-700 bg-gray-800/70">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {React.createElement(sections[expandedSection].icon, { 
                      size: 24, 
                      className: "text-purple-400" 
                    })}
                    <h2 className="text-xl font-semibold">
                      {sections[expandedSection].title}
                    </h2>
                  </div>
                  <button
                    onClick={() => setExpandedSection(null)}
                    className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
                  >
                    Back to Overview
                  </button>
                </div>
              </div>
              
              {/* Expanded Section Content */}
              <div className="h-full p-6 overflow-auto">
                {React.createElement(sections[expandedSection].component)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;