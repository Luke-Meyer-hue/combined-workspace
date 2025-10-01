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

      {/* App List */}
      <main className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-1">
        {filteredApps.map((app) => (
          <article
            key={app.name}
            onClick={() => openApp(app)}
            className="p-4 border border-gray-700 rounded-lg bg-gray-800/70 hover:border-purple-400 hover:scale-105 transition cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label={`Open ${app.name}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") openApp(app);
            }}
          >
            <figure className="mb-3">
              <div className="h-16 w-16 bg-gray-600/40 rounded-lg flex items-center justify-center">
                <span className="text-gray-300 text-lg" aria-hidden="true">
                  {app.name[0]}
                </span>
              </div>
              <figcaption className="mt-2">
                <p className="text-gray-200 font-medium">{app.name}</p>
                <p className="text-xs text-gray-400">{app.category}</p>
              </figcaption>
            </figure>
          </article>
        ))}
      </main>
    </section>
  );
};

export default WorkspaceSection;
