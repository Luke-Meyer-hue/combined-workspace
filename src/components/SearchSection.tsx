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
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const quickLinks = [
    { name: "YouTube", url: "https://youtube.com", color: "bg-red-500/20 text-red-300" },
    { name: "GitHub", url: "https://github.com", color: "bg-gray-500/20 text-gray-300" },
    { name: "Stack Overflow", url: "https://stackoverflow.com", color: "bg-orange-500/20 text-orange-300" },
    { name: "MDN Docs", url: "https://developer.mozilla.org", color: "bg-blue-500/20 text-blue-300" },
    { name: "React Docs", url: "https://react.dev", color: "bg-cyan-500/20 text-cyan-300" },
    { name: "Tailwind CSS", url: "https://tailwindcss.com", color: "bg-teal-500/20 text-teal-300" },
  ];

  // Determine if we can embed a site in an iframe
  const canEmbed = (url: string) => {
    const blockedHosts = ["google.com", "gmail.com", "docs.google.com"];
    return !blockedHosts.some(host => url.includes(host));
  };

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;

    // Save to history
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
        setIframeUrl(null); // show list first
      }
    } catch (err) {
      console.error("Search failed", err);
    }

    setQuery("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch(query);
  };

  const handleClickResult = (link: string) => {
    if (canEmbed(link)) {
      setIframeUrl(link);
    } else {
      window.open(link, "_blank");
    }
  };

  const handleBack = () => setIframeUrl(null);

  const handleDirectUrl = (url: string) => window.open(url, "_blank");

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
            onChange={e => setQuery(e.target.value)}
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
          {quickLinks.map(link => (
            <button
              key={link.name}
              onClick={() => handleDirectUrl(link.url)}
              className={`p-3 rounded-lg border border-gray-700 transition-all duration-200
                         hover:scale-105 hover:border-gray-600 ${link.color}
                         flex items-center justify-center space-x-2`}
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

      {/* Panel for search results */}
      {showPanel && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="relative bg-gray-900 border-4 border-purple-500 rounded-2xl w-11/12 md:w-4/5 h-5/6 shadow-xl overflow-hidden flex flex-col">
            <button
              onClick={() => setShowPanel(false)}
              className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 z-10"
            >
              <X size={16} /> <span>Close</span>
            </button>

            {!iframeUrl ? (
              <div className="p-6 overflow-y-auto flex-1">
                {results.map((item, idx) => (
                  <div
                    key={idx}
                    className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-700 transition"
                    onClick={() => handleClickResult(item.link)}
                  >
                    <h4 className="font-semibold text-purple-400">{item.title}</h4>
                    <p className="text-gray-300 mt-1">{item.snippet}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div
                  className="p-3 bg-gray-800 text-white cursor-pointer hover:bg-gray-700 border-b border-gray-700"
                  onClick={handleBack}
                >
                  ⬅ Back to results
                </div>
                <iframe src={iframeUrl} className="flex-1 w-full" title="Embedded Page" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSection;
