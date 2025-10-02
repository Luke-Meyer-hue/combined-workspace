import React, { useState } from "react";
import { Search, ExternalLink, X } from "lucide-react";

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

const SearchSection: React.FC = () => {
  const [query, setQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([
    "React hooks tutorial",
    "TypeScript best practices",
    "Tailwind CSS components",
  ]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showPanel, setShowPanel] = useState(false);

  const quickLinks = [
    { name: "YouTube", url: "https://youtube.com" },
    { name: "GitHub", url: "https://github.com" },
    { name: "Stack Overflow", url: "https://stackoverflow.com" },
    { name: "MDN Docs", url: "https://developer.mozilla.org" },
    { name: "React Docs", url: "https://react.dev" },
    { name: "Tailwind CSS", url: "https://tailwindcss.com" },
  ];

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;

    if (!searchHistory.includes(q)) {
      setSearchHistory(prev => [q, ...prev.slice(0, 9)]);
    }

    try {
      const res = await fetch(`http://localhost:4000/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();

      if (data.items) {
        const mapped: SearchResult[] = data.items.map((item: any) => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
        }));
        setResults(mapped);
        setShowPanel(true);
      }
    } catch (err) {
      console.error("Search failed", err);
    }

    setQuery("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch(query);
  };

  return (
    <div className="h-full flex flex-col space-y-6 font-mono">
      {/* Title */}
      <h3 className="text-xl mb-2 text-purple-300 flex items-center">
        <Search className="mr-2 text-purple-400" size={20} /> Search Menu
      </h3>

      {/* Search Box */}
      <div className="border-2 border-purple-500 bg-gray-900/80 p-3 rounded-none shadow-lg">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="> Enter your query..."
          className="w-full bg-transparent focus:outline-none text-purple-200 placeholder-purple-400 text-lg"
        />
      </div>

      {/* Quick Links styled like RPG buttons */}
      <div>
        <h4 className="text-purple-300 mb-2">Quick Links</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {quickLinks.map(link => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-purple-500 bg-gray-800/80 hover:bg-purple-700/40 
                         text-purple-200 px-3 py-2 text-center transition-all duration-150
                         flex items-center justify-center space-x-2 shadow-md"
            >
              <ExternalLink size={14} className="text-purple-400" />
              <span>{link.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Searches as selectable list */}
      {searchHistory.length > 0 && (
        <div>
          <h4 className="text-purple-300 mb-2">Recent Searches</h4>
          <div className="space-y-1">
            {searchHistory.slice(0, 5).map((historyQuery, index) => (
              <button
                key={index}
                onClick={() => handleSearch(historyQuery)}
                className="w-full text-left px-3 py-2 border-2 border-purple-500 
                           bg-gray-800/80 hover:bg-purple-700/40 text-purple-200 
                           flex items-center space-x-2 transition-all duration-150"
              >
                <Search size={14} className="text-purple-400 flex-shrink-0" />
                <span>{historyQuery}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* RPG-style Results Panel */}
      {showPanel && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="relative bg-gray-900 border-4 border-purple-500 shadow-xl w-11/12 md:w-4/5 h-5/6 flex flex-col">
            <button
              onClick={() => setShowPanel(false)}
              className="absolute top-2 right-2 border-2 border-purple-500 bg-gray-800 hover:bg-purple-600 text-purple-200 px-3 py-1 flex items-center space-x-1"
            >
              <X size={14} /> <span>Close</span>
            </button>

            <div className="p-4 overflow-y-auto flex-1">
              {results.map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mb-3 border-2 border-purple-500 bg-gray-800/80 hover:bg-purple-700/40 p-3 transition"
                >
                  <h4 className="text-purple-300">{item.title}</h4>
                  <p className="text-gray-300 text-sm">{item.snippet}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSection;
