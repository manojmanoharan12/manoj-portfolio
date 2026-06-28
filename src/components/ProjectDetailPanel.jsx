import React from 'react';

const ProjectDetailPanel = ({ project }) => {
  return (
    <div className="flex flex-col p-8 backdrop-blur-lg bg-white/90 dark:bg-black/90 text-black dark:text-white rounded-xl border border-black/10 dark:border-white/10 shadow-2xl text-left pointer-events-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Labels & Values */}
        <div className="space-y-4">
          <div>
            <h4 className="text-xs uppercase tracking-widest text-neutral-400 font-mono">Company</h4>
            <p className="text-sm font-semibold">{project.company}</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-neutral-400 font-mono">Deliverable</h4>
            <p className="text-sm font-semibold">{project.deliverable}</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-neutral-400 font-mono">Business Goal</h4>
            <p className="text-sm italic text-gray-400">{project.goal}</p>
          </div>
        </div>
        
        {/* Right Side: Tool Logos */}
        <div className="flex flex-col h-full">
          <div>
            <h4 className="text-xs uppercase tracking-widest text-neutral-400 font-mono mb-4">Tools</h4>
            <div className="flex gap-3">
              {project.tools.map((tool, idx) => (
                <div key={tool.name || idx} className="w-6 h-6 flex items-center justify-center">
                  {tool.iconPath ? (
                    <img 
                      src={tool.iconPath} 
                      alt={tool.name} 
                      className="w-full h-full object-contain" 
                      style={{ aspectRatio: '1 / 1' }} 
                    />
                  ) : (
                    <span className="text-xs font-mono border border-black/10 dark:border-white/10 px-1.5 py-0.5 rounded uppercase tracking-widest">{tool.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mt-8 pt-4 border-t border-black/10 dark:border-white/10">
        <h3 className="font-serif text-lg font-bold tracking-tight">
          {project.title}
        </h3>
      </div>
    </div>
  );
};

export default ProjectDetailPanel;
