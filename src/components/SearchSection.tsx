import React, { useState } from 'react';
import { Search, ExternalLink, Youtube, Globe, Github } from 'lucide-react';

const SearchSection: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([
    'React hooks tutorial',
    'TypeScript best practices',
    'Tailwind CSS components',
  ]);

  const searchEngines = [
    { 
      name: 'Google', 
      icon: Globe, 
      url: 'https://www.google.com/search?q=',
      color: 'text-blue-400',
      bg: 'bg-blue-500/20 hover:bg-blue-500/30'
    },
    { 
      name: 'YouTube', 
      icon: Youtube, 
      url: 'https://www.youtube.com/results?search_query=',
      color: 'text-red-400',
      bg: 'bg-red-500/20 hover:bg-red-500/30'
    },
    { 
      name: 'GitHub', 
      icon: Github, 
      url: 'https://github.com/search?q=',
      color: 'text-gray-300',
      bg: 'bg-gray-500/20 hover:bg-gray-500/30'
    },
  ];

  const quickLinks = [
    { name: 'YouTube', url: 'https://youtube.com', color: 'bg-red-500/20 text-red-300' },
    { name: 'GitHub', url: 'https://github.com', color: 'bg-gray-500/20 text-gray-300' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com', color: 'bg-orange-500/20 text-orange-300' },
    { name: 'MDN Docs', url: 'https://developer.mozilla.org', color: 'bg-blue-500/20 text-blue-300' },
    { name: 'React Docs', url: 'https://react.dev', color: 'bg-cyan-500/20 text-cyan-300' },
    { name: 'Tailwind CSS', url: 'https://tailwindcss.com', color: 'bg-teal-500/20 text-teal-300' },
  ];

  const handleSearch = (searchEngine: typeof searchEngines[0]) => {
    if (!query.trim()) return;
    
    const searchUrl = searchEngine.url + encodeURIComponent(query);
    window.open(searchUrl, '_blank');
    
    // Add to search history
    if (!searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 9)]);
    }
    
    setQuery('');
  };

  const handleDirectUrl = (url: string) => {
    window.open(url, '_blank');
  };

  const handleKeyPress = (e: React.KeyboardEvent, searchEngine?: typeof searchEngines[0]) => {
    if (e.key === 'Enter') {
      if (searchEngine) {
        handleSearch(searchEngine);
      } else if (searchEngines.length > 0) {
        handleSearch(searchEngines[0]); // Default to first search engine
      }
    }
  };

  return (
    <div className="h-full flex flex-col space-y-8">
      {/* Main Search Bar */}
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
            onKeyPress={(e) => handleKeyPress(e)}
            placeholder="Search anything on the web..."
            className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600 rounded-2xl 
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                     text-lg placeholder-gray-400 transition-all duration-200"
          />
        </div>
      </div>

      {/* Search Engines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {searchEngines.map((engine, index) => {
          const IconComponent = engine.icon;
          return (
            <button
              key={engine.name}
              onClick={() => handleSearch(engine)}
              disabled={!query.trim()}
              className={`
                p-4 rounded-xl border border-gray-700 transition-all duration-200
                ${engine.bg} ${query.trim() ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'}
                disabled:hover:scale-100
              `}
            >
              <div className="flex items-center justify-center space-x-3">
                <IconComponent className={engine.color} size={24} />
                <span className="font-semibold">Search on {engine.name}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-gray-300">Quick Links</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickLinks.map((link, index) => (
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

      {/* Search History */}
      {searchHistory.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-300">Recent Searches</h4>
          <div className="space-y-2">
            {searchHistory.slice(0, 5).map((historyQuery, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(historyQuery);
                  handleSearch(searchEngines[0]);
                }}
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

      {/* Tips */}
      <div className="mt-auto pt-6 border-t border-gray-700">
        <div className="text-center text-sm text-gray-400">
          <p className="mb-2">💡 <strong>Pro Tips:</strong></p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <p>• Press Enter to search on Google</p>
            <p>• Click search engine buttons for specific searches</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;