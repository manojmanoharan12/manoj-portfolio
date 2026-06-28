import React from 'react'
import { motion } from 'framer-motion'
import ZoomWrapper from './ZoomWrapper'

export default function LensSection({ jpegs, skewY, setCursorHovered, setSelectedWork }) {
  if (!jpegs || jpegs.length === 0) return null

  return (
    <section id="darkroom" className="relative bg-black pt-12 pb-12 mb-10 md:mb-14">
      
      {/* Minimal elegant title */}
      <div className="sticky top-0 z-50 w-full py-6 mb-24 flex flex-col justify-end">
        <div className="absolute inset-y-0 w-[100vw] left-1/2 -translate-x-1/2 bg-transparent backdrop-blur-md border-b border-black/10 dark:border-white/10 -z-10 pointer-events-none" />
        <span className="font-sans text-neutral-400 text-xs tracking-wider block mb-3">
          Visual Studies
        </span>
        <h2 className="font-sans text-3xl md:text-5xl font-bold text-white tracking-tight">
          Photography
        </h2>
      </div>

      {/* Clean Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 relative z-10">
        {jpegs.map((photo, index) => (
          <ZoomWrapper
            key={photo.id}
            style={{ skewY }}
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
            {/* Elegant hover overlay */}
            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end p-2 sm:p-4">
              <span className="font-mono text-[11px] sm:text-xs tracking-wider text-white bg-black/80 px-2 py-1 border border-white/10 rounded truncate max-w-full">
                {index + 1 < 10 ? `0${index + 1}` : index + 1} &bull; {photo.title}
              </span>
            </div>
          </ZoomWrapper>
        ))}
      </div>
    </section>
  )
}
