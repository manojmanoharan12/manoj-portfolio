import React from 'react'
import { motion } from 'framer-motion'

export default function LensSection({ jpegs, skewY, setCursorHovered, setSelectedWork }) {
  if (!jpegs || jpegs.length === 0) return null

  return (
    <section id="darkroom" className="relative bg-black py-24 mb-40 md:mb-56 overflow-hidden">
      
      {/* Minimal elegant title */}
      <div className="mb-24">
        <span className="font-sans text-neutral-500 text-[10px] tracking-wider block mb-3">
          Lens / visual studies
        </span>
        <h2 className="font-sans text-3xl md:text-5xl font-bold text-white tracking-tight">
          Lens / visual studies
        </h2>
      </div>

      {/* Clean 3-Column Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 relative z-10">
        {jpegs.map((photo, index) => (
          <motion.div
            key={photo.id}
            layoutId={`work-media-${photo.id}`}
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
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
            />
            {/* Elegant hover overlay */}
            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end p-2 sm:p-4">
              <span className="font-mono text-[8px] sm:text-[9px] tracking-wider text-white bg-black/80 px-2 py-1 border border-white/10 rounded truncate max-w-full">
                {index + 1 < 10 ? `0${index + 1}` : index + 1} &bull; {photo.title}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
