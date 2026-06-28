import React from 'react'
import ZoomWrapper from './ZoomWrapper'

export default function PhotographyArchive({ jpegs, setCursorHovered, setSelectedWork }) {
  if (!jpegs || jpegs.length === 0) return null

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 md:py-24 max-w-7xl mx-auto w-full font-sans">
      <header className="flex justify-between items-center mb-16 md:mb-24 border-b border-white/20 pb-8">
        <div>
          <span className="text-neutral-400 text-xs tracking-wider block mb-3 uppercase font-mono">Archive</span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Visual Studies</h1>
        </div>
        <button 
          onClick={() => window.location.pathname = '/'}
          className="px-6 py-2 border border-white/20 hover:border-white text-white font-mono uppercase tracking-widest text-xs transition-all cursor-none"
          onMouseEnter={() => setCursorHovered(true)}
          onMouseLeave={() => setCursorHovered(false)}
        >
          Back
        </button>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 relative z-10">
        {jpegs.map((photo, index) => (
          <ZoomWrapper
            key={photo.id}
            className="relative overflow-hidden aspect-[3/4] rounded border border-neutral-900 bg-neutral-950 group cursor-none select-none will-change-transform"
            onMouseEnter={() => setCursorHovered(true)}
            onMouseLeave={() => setCursorHovered(false)}
            onClick={() => setSelectedWork(photo)}
          >
            <img
              src={photo.image}
              alt={photo.title}
              decoding="async"
              loading="lazy"
              width="800"
              height="1200"
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end p-2 sm:p-4">
              <span className="font-mono text-[11px] sm:text-xs tracking-wider text-white bg-black/80 px-2 py-1 border border-white/10 rounded truncate max-w-full">
                {index + 1 < 10 ? `0${index + 1}` : index + 1} &bull; {photo.title}
              </span>
            </div>
          </ZoomWrapper>
        ))}
      </div>
    </div>
  )
}
