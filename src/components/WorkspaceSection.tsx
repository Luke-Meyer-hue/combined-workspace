import React, { useState, useEffect } from "react";
import { Package } from "lucide-react";
import appsData from "./apps.json"; // import JSON file

const categories = ["All", "Games", "Spreadsheets", "Tools"];

const WorkspaceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [apps, setApps] = useState<any[]>([]);

  useEffect(() => {
    setApps(appsData); // load from JSON
  }, []);

  const filteredApps =
    activeTab === "All" ? apps : apps.filter((app) => app.category === activeTab);

  const openApp = async (app: any) => {
    try {
      const response = await fetch("http://localhost:4000/open-app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: app.name }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error(data.error);
        alert(`Failed to open ${app.name}: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to open ${app.name}`);
    }
  };

  return (
    <section className="h-full flex flex-col" aria-labelledby="workspace-title">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <h3
          id="workspace-title"
          className="text-2xl font-bold flex items-center gap-2 text-purple-300"
        >
          <Package size={28} aria-hidden="true" /> Workspace
        </h3>

        {/* Tabs */}
        <nav aria-label="Workspace categories">
          <ul className="flex space-x-3">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setActiveTab(cat)}
                  className={`px-4 py-2 rounded-lg border transition ${
                    activeTab === cat
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-gray-700/40 text-gray-300 border-gray-600 hover:bg-gray-600/60"
                  }`}
                  aria-pressed={activeTab === cat}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* App List - RPG Inventory Style */}
      <main className="flex-1 bg-gray-900/70 border border-gray-700 rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-700">
          {filteredApps.map((app) => (
            <li
              key={app.name}
              onClick={() => openApp(app)}
              role="button"
              tabIndex={0}
              aria-label={`Open ${app.name}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") openApp(app);
              }}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-700/50 cursor-pointer transition"
            >
              {/* Left side - icon + name */}
              <div className="flex items-center gap-3">
                <span className="text-purple-300">🧪</span>
                <span className="text-gray-200 font-medium">{app.name}</span>
              </div>

              {/* Right side - mimic item count (if provided in JSON) */}
              <span className="text-gray-400">{app.count ?? 1}</span>
            </li>
          ))}
        </ul>
      </main>
    </section>
  );
};

export default WorkspaceSection;
