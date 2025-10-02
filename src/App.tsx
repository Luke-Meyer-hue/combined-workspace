import React, { useState, useEffect } from "react";
import { Calendar, Search, Package } from "lucide-react";
import CalendarSection from "./components/CalendarSection";
import SearchSection from "./components/SearchSection";
import BlankSection from "./components/WorkspaceSection";
import logo from "./images/Search.png";

function App() {
  const [selectedSection, setSelectedSection] = useState(0);

  const sections = [
    { id: 0, title: "Calendar", icon: Calendar, component: CalendarSection },
    { id: 1, title: "Search", icon: Search, component: SearchSection },
    { id: 2, title: "Workspace", icon: Package, component: BlankSection },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
          e.preventDefault();
          setSelectedSection((prev) => (prev - 1 + sections.length) % sections.length);
          break;
        case "s":
        case "arrowdown":
          e.preventDefault();
          setSelectedSection((prev) => (prev + 1) % sections.length);
          break;
        case "enter":
          e.preventDefault();
          // Could trigger submenu or confirmation later
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sections.length]);

  const ActiveComponent = sections[selectedSection].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex font-mono">
      {/* Sidebar Menu */}
      <div className="w-64 border-r border-purple-600 bg-gray-800/80 flex flex-col">
      <div className="text-center border-b border-purple-600">
        <img 
          src={logo} 
          alt="App Logo" 
          className="w-full h-full object-cover" 
        />
      </div>

        <div className="flex-1 flex flex-col">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            const isSelected = selectedSection === index;

            return (
              <div
                key={section.id}
                onClick={() => setSelectedSection(index)}
                className={`flex items-center px-6 py-4 cursor-pointer transition-all
                  ${isSelected
                    ? "bg-purple-700/40 border-l-4 border-purple-400 text-white"
                    : "text-gray-400 hover:bg-gray-700/50 hover:text-gray-200"}
                `}
              >
                <IconComponent size={20} className="mr-3" />
                <span className="font-medium">{section.title}</span>
              </div>
            );
          })}
        </div>

        <div className="p-4 text-xs text-gray-400 text-center border-t border-purple-600">
          ↑/↓ or W/S to move • Enter to select
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-900/70 overflow-auto">
        <div className="border border-purple-600 rounded-xl p-6 shadow-lg bg-gray-800/80">
          <h2 className="text-xl font-semibold text-purple-300 mb-4 flex items-center">
            {React.createElement(sections[selectedSection].icon, {
              size: 20,
              className: "mr-2 text-purple-400",
            })}
            {sections[selectedSection].title}
          </h2>
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}

export default App;
