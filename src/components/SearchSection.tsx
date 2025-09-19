import React, { useState } from 'react';
import { Search, ExternalLink, X } from 'lucide-react';

const SearchSection: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([
    'React hooks tutorial',
    'TypeScript best practices',
    'Tailwind CSS components',
  ]);
  const [modalUrl, setModalUrl] = useState<string | null>(null);

  const quickLinks = [
    { name: 'YouTube', url: 'https://youtube.com', color: 'bg-red-500/20 text-red-300' },
    { name: 'GitHub', url: 'https://github.com', color: 'bg-gray-500/20 text-gray-300' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com', color: 'bg-orange-500/20 text-orange-300' },
    { name: 'MDN Docs', url: 'https://developer.mozilla.org', color: 'bg-blue-500/20 text-blue-300' },
    { name: 'React Docs', url: 'https://react.dev', color: 'bg-cyan-500/20 text-cyan-300' },
    { name: 'Tailwind CSS', url: 'https://tailwindcss.com', color: 'bg-teal-500/20 text-teal-300' },
  ];

  const handleSearch = (q: string) => {
    if (!q.trim()) return;

    // Add to history
    if (!searchHistory.includes(q)) {
      setSearchHistory(prev => [q, ...prev.slice(0, 9)]);
    }

    // Open Google search in modal iframe
    const url = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
    setModalUrl(url);
    setQuery('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch(query);
  };

  const handleDirectUrl = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="h-full flex flex-col space-y-8">
      {/* Search Bar */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Universal Search
        </h3>
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search anything on the web..."
            className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600 rounded-2xl 
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                     text-lg placeholder-gray-400 transition-all duration-200"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-gray-300">Quick Links</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleDirectUrl(link.url)}
              className={`
                p-3 rounded-lg border border-gray-700 transition-all duration-200
                hover:scale-105 hover:border-gray-600 ${link.color}
                flex items-center justify-center space-x-2
              `}
            >
              <ExternalLink size={16} />
              <span className="font-medium">{link.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Searches */}
      {searchHistory.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-300">Recent Searches</h4>
          <div className="space-y-2">
            {searchHistory.slice(0, 5).map((historyQuery, index) => (
              <button
                key={index}
                onClick={() => handleSearch(historyQuery)}
                className="w-full text-left p-3 bg-gray-800/30 hover:bg-gray-700/50 
                         rounded-lg border border-gray-700/50 transition-colors duration-200
                         flex items-center space-x-3"
              >
                <Search size={16} className="text-gray-400 flex-shrink-0" />
                <span className="text-gray-300 truncate">{historyQuery}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Google Search */}
      {modalUrl && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="relative bg-gray-900 border-4 border-purple-500 rounded-2xl w-11/12 md:w-4/5 h-5/6 shadow-xl overflow-hidden">
            <button
              onClick={() => setModalUrl(null)}
              className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1"
            >
              <X size={16} /> <span>Close</span>
            </button>
            <iframe
              src={modalUrl}
              className="w-full h-full rounded-xl"
              title="Google Search Results"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSection;
