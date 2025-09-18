import React from 'react';
import { Package, Sparkles, Zap, Rocket } from 'lucide-react';

const BlankSection: React.FC = () => {
  const upcomingFeatures = [
    {
      icon: Sparkles,
      title: 'AI Assistant',
      description: 'Get help with tasks and questions using AI',
      status: 'Planning',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    {
      icon: Zap,
      title: 'Quick Notes',
      description: 'Jot down thoughts and ideas instantly',
      status: 'In Progress',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10'
    },
    {
      icon: Rocket,
      title: 'Task Manager',
      description: 'Organize your todos and track progress',
      status: 'Coming Soon',
      color: 'text-green-400',
      bg: 'bg-green-500/10'
    }
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
      {/* Main Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-xl"></div>
        <div className="relative p-8 bg-gray-800/50 rounded-full border border-gray-700">
          <Package size={64} className="text-gray-400" />
        </div>
      </div>

      {/* Title and Description */}
      <div className="max-w-md space-y-4">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Your Workspace
        </h3>
        <p className="text-gray-400 text-lg leading-relaxed">
          This section is ready for your next big idea. What would you like to build here?
        </p>
      </div>

      {/* Upcoming Features */}
      <div className="w-full max-w-2xl">
        <h4 className="text-xl font-semibold mb-6 text-gray-300">Potential Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.title}
                className={`
                  p-6 rounded-xl border border-gray-700 ${feature.bg}
                  hover:border-gray-600 transition-all duration-200 hover:scale-105
                  cursor-pointer group
                `}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`p-3 rounded-full bg-gray-800/50 ${feature.color} group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent size={24} />
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-gray-200 mb-1">
                      {feature.title}
                    </h5>
                    <p className="text-sm text-gray-400 mb-2">
                      {feature.description}
                    </p>
                    <span className={`
                      text-xs px-2 py-1 rounded-full ${feature.color} ${feature.bg}
                    `}>
                      {feature.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl border border-gray-700 max-w-lg">
        <h5 className="text-lg font-semibold mb-2 text-gray-200">Ready to customize?</h5>
        <p className="text-sm text-gray-400 mb-4">
          This workspace is completely customizable. Add your own components, integrate APIs, or build something entirely new.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {['Widget', 'Dashboard', 'Tools', 'Games'].map((suggestion) => (
            <span
              key={suggestion}
              className="px-3 py-1 text-xs bg-gray-700/50 text-gray-300 rounded-full hover:bg-gray-600/50 cursor-pointer transition-colors duration-200"
            >
              {suggestion}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlankSection;