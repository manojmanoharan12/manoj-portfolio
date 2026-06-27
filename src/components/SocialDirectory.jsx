import React from 'react'

export default function SocialDirectory({ socialLinks, setCursorHovered }) {
  return (
    <section id="contact" className="pb-16 my-12 relative">
      <hr className="w-full border-t border-neutral-900 my-0 mb-20 md:mb-28" />
      <div className="mb-20">
        <span className="font-sans text-neutral-500 text-[10px] tracking-wider block mb-3">
          Social directory
        </span>
        <h2 className="font-sans text-3xl md:text-5xl font-bold text-white tracking-tight">
          Connect
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-neutral-800">
        {socialLinks.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            aria-label={`Link to Manoj Manoharan's ${link.label}`}
            target={link.url.startsWith('mailto:') || link.url.startsWith('tel:') ? undefined : "_blank"}
            rel={link.url.startsWith('mailto:') || link.url.startsWith('tel:') ? undefined : "noopener noreferrer"}
            onMouseEnter={() => setCursorHovered(true)}
            onMouseLeave={() => setCursorHovered(false)}
            className="group relative flex items-center justify-between p-8 border-r border-b border-neutral-800 transition-colors duration-200 hover:bg-white cursor-none"
          >
            <div className="flex items-center gap-4 text-neutral-500 group-hover:text-black transition-colors duration-200">
              <div className="shrink-0">{link.icon}</div>
              <span className="font-sans text-sm font-bold">{link.label}</span>
            </div>
            
            {/* Directional Arrow (Slide in from right) */}
            <div className="text-black overflow-hidden flex items-center ml-4">
              <span className="inline-block text-lg font-bold transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                ↗
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
