import React, { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useVelocity, useSpring, useMotionValue } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

import Lenis from 'lenis'
import portfolioData from './data/portfolio.json'
import heroPortrait from './assets/headshot/IMG_4669_clean.png'
import { SiBehance } from 'react-icons/si'
import { TbBrandFigma, TbBrandAdobeIllustrator, TbBrandAdobeAfterEffect, TbBrandAdobePremier, TbBrandAdobePhotoshop, TbBrandAdobeIndesign } from "react-icons/tb"
import ZoomWrapper from './components/ZoomWrapper'
import { GlobalImageModal } from './components/GlobalImageModal'

const LensSection = lazy(() => import('./components/LensSection'))
const PhotographyArchive = lazy(() => import('./components/PhotographyArchive'))
const SocialDirectory = lazy(() => import('./components/SocialDirectory'))
import Preloader from './components/Preloader'
import BackToTop from './components/BackToTop'
import cvPdf from './assets/cv/Manoj Manoharan - SGD.pdf'

// Dynamically import all photography JPEGs from the local folder
const jpegModules = import.meta.glob('./assets/jpegs/*.{jpeg,jpg,JPG,JPEG}', { eager: true })
const jpegs = Object.keys(jpegModules).map((path, idx) => {
  const filename = path.split('/').pop()
  const cleanTitle = filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
  const formatted = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1).toLowerCase()
  return {
    id: `photo-${idx}`,
    title: formatted,
    image: jpegModules[path].default || jpegModules[path]
  }
})

// Asset Editorial Metadata Dictionary
const assetMetadata = {
  // PNGs
  "Colliers 1.webp": { title: "Colliers Regional APAC Analysis", subtitle: "Editorial Design // Layout Systems", impact: "APAC Regional Delivery" },
  "Colliers 2.webp": { title: "Colliers APAC Market Insights", subtitle: "Editorial Design // Layout Systems", impact: "APAC Regional Delivery" },
  "Colliers 3.webp": { title: "Colliers Growth & Storytelling Layouts", subtitle: "Editorial Design // Layout Systems", impact: "APAC Regional Delivery" },
  "Colliers 4.webp": { title: "Colliers Market Intelligence", subtitle: "Editorial Design // Layout Systems", impact: "APAC Regional Delivery" },
  "Colliers 5.webp": { title: "Colliers Commercial Property Index", subtitle: "Editorial Design // Layout Systems", impact: "APAC Regional Delivery" },
  "EY 1.webp": { title: "EY Technology Advisory Campaigns", subtitle: "Brand Campaign // Visual Assets", impact: "Authority Strategy" },
  "EY 2.webp": { title: "EY Digital Advisory Assets", subtitle: "Brand Campaign // Visual Assets", impact: "Authority Strategy" },
  "EY 3.webp": { title: "EY Corporate Advisory Strategy", subtitle: "Brand Campaign // Visual Assets", impact: "Authority Strategy" },
  "EY 4.webp": { title: "EY EMEA Banking Report Layouts", subtitle: "Brand Campaign // Visual Assets", impact: "Authority Strategy" },
  "EY 5.webp": { title: "EY Advisory Board Presentation", subtitle: "Brand Campaign // Visual Assets", impact: "Authority Strategy" },
  "EY 6.webp": { title: "EY Advisory Strategic Campaigns", subtitle: "Brand Campaign // Visual Assets", impact: "Authority Strategy" },
  "Elevate 2025 Awards - Badges - HQ 1.png": { title: "Elevate 2025 Awards Badges", subtitle: "Corporate Brand Event // Digital Design", impact: "Corporate Brand Event" },
  "Elevate product promo - Nov 18 2027.png": { title: "Elevate Product Promo Sequence", subtitle: "Digital Design // Campaign Advertising", impact: "Corporate Brand Event" },
  "ElevatsOS webpage.png": { title: "ElevateOS Webpage Design", subtitle: "Digital Design // Campaign Advertising", impact: "Corporate Brand Event" },
  "Frame 37.png": { title: "Interactive Product Showcase Frame", subtitle: "Digital Design // Campaign Advertising", impact: "Corporate Brand Event" },
  "KPMG 1.webp": { title: "KPMG Corporate Pitch Systems", subtitle: "Presentation Design // Layout Systems", impact: "Proposal Optimization" },
  "KPMG 2.jpeg": { title: "KPMG International Bids Visuals", subtitle: "Presentation Design // Layout Systems", impact: "Proposal Optimization" },
  "KPMG 3.webp": { title: "KPMG Advisory Board Proposal Layouts", subtitle: "Presentation Design // Layout Systems", impact: "Proposal Optimization" },
  "KPMG 4.webp": { title: "KPMG Deal Advisory Brand Presentation", subtitle: "Presentation Design // Layout Systems", impact: "Proposal Optimization" },
  "KPMG 5.webp": { title: "KPMG International Client Proposal Design", subtitle: "Presentation Design // Layout Systems", impact: "Proposal Optimization" },
  "LinkedIn - Square - On-Demand.png": { title: "LinkedIn On-Demand Campaign Ads", subtitle: "Digital Design // Campaign Advertising", impact: "Campaign Advertising" },
  "LinkedIn Square 1200 x 1200 px.png": { title: "LinkedIn Event Square Promo Ads", subtitle: "Digital Design // Campaign Advertising", impact: "Campaign Advertising" },
  "LinkedIn Square_ 1200 x 1200 px.png": { title: "LinkedIn Visual Brand Square Assets", subtitle: "Digital Design // Campaign Advertising", impact: "Campaign Advertising" },
  "LinkedIn _ Static Ads V2 - Option 1 - 1200x1200.png": { title: "LinkedIn Interactive Static Ad Concepts", subtitle: "Digital Design // Campaign Advertising", impact: "Campaign Advertising" },
  "Social Post _ 1080x1080.png": { title: "Social Media Campaign Visual Templates", subtitle: "Digital Design // Campaign Advertising", impact: "Campaign Advertising" },
  "X.png": { title: "X Platform Interactive Campaign Promos", subtitle: "Digital Design // Campaign Advertising", impact: "Campaign Advertising" },
  "i6.png": { title: "Interactive Feature Product Interface", subtitle: "Digital Design // Campaign Advertising", impact: "Campaign Advertising" },

  // GIFs
  "GIF 2.gif": { title: "Dynamic Product Promo Video Sequence", subtitle: "Motion Graphics // After Effects", impact: "Elevating Brand Motion" },
  "GIF 3.gif": { title: "Mindtickle VS Seismic", subtitle: "Motion Graphics // LinkedIn Post", impact: "Elevating Brand Motion" },
  "GIF 4.gif": { title: "Vector Animated Brand Identity Asset", subtitle: "Motion Graphics // After Effects", impact: "Elevating Brand Motion" },
  "Gif 1.gif": { title: "SaaS Brand Animated Launch Sequence", subtitle: "Motion Graphics // After Effects", impact: "Elevating Brand Motion" },
  "MT Bumper.mp4": { title: "Mindtickle Conference Video Bumper", subtitle: "Motion Identity // Conference Bumper", impact: "Global Event Presence" },
  "Post 5- Customer-Focused & Results-Driven.mp4": { title: "Customer-Focused Promo Motion Sequence", subtitle: "Motion Graphics // After Effects", impact: "Digital Conversion Lead" }
}

const getProjectDetails = (project) => {
  const title = (project.title || '').toLowerCase();
  
  if (project.id === 'gif-0' || title.includes('gartner')) {
    return {
      titleOverride: "Gartner Magic Quadrant promo",
      client: "Mindtickle",
      deliverable: "LinkedIn Post",
      goal: "To promote the Leader position achieved in the Gartner Magic Quadrant 2026",
      tools: ["After Effects", "Illustrator"]
    };
  }
  
  if (project.id === 'gif-1' || title.includes('vs seismic') || title.includes('interactive motion graphics')) {
    return {
      client: "Mindtickle",
      deliverable: "LinkedIn Post",
      goal: "Comparison campaign to show how Mindtickle's product is industry-ready when compared to Seismic.",
      tools: ["After Effects", "Illustrator"]
    };
  }

  if (project.id === 'gif-2') {
    return {
      titleOverride: "Accelerate your Success campaign",
      client: "Colliers",
      deliverable: "LinkedIn Post",
      goal: "To attract talent across the APAC region",
      tools: ["After Effects", "Illustrator"]
    };
  }

  if (project.id === 'gif-3') {
    return {
      titleOverride: "Mindtickle VS Seismic Campaign",
      client: "Mindtickle",
      deliverable: "LinkedIn Post, Blog Page Banner",
      goal: "To showcase the Success rate of the AI RolePlay feature of Mindtickle",
      tools: ["After Effects", "Illustrator"]
    };
  }
  
  if (project.id === 'gif-4') {
    return {
      titleOverride: "Mindtickle Logo Animation",
      client: "Mindtickle",
      deliverable: "Intro Bumper",
      goal: "Revamped the Mindtickle's logo introductory bumper to use across the promotional videos",
      tools: ["After Effects", "Illustrator"]
    };
  }
  if (project.id === 'gif-5') {
    return {
      titleOverride: "Mindtickle's AI Role Play Milestone",
      client: "Mindtickle",
      deliverable: "LinkedIn Post",
      goal: "To showcase the milestone of the number of AI Role Plays completed for the Global GTM teams",
      tools: ["After Effects", "Illustrator", "Figma"]
    };
  }
  if (project.id === 'png-0') {
    return {
      titleOverride: "Colliers | Euromoney Real Estate Awards 2024",
      client: "Colliers",
      deliverable: "LinkedIn Post",
      goal: "Promoted the Euromoney Real Estate 2024 Awards that Colliers Received.",
      tools: ["Illustrator"]
    };
  }

  if (project.id === 'png-1') {
    return {
      titleOverride: "Colliers | Global Capital Flows 2024",
      client: "Colliers",
      deliverable: "LinkedIn Post",
      goal: "Promoted the Global Capital Flows report for the month of March 2024",
      tools: ["Illustrator"]
    };
  }

  if (project.id === 'png-2') {
    return {
      titleOverride: "Colliers | APAC Market insights Report",
      client: "Colliers",
      deliverable: "LinkedIn Post",
      goal: "Promoted the APAC Market Insights report",
      tools: ["Illustrator"]
    };
  }

  if (title.includes('colliers')) {
    return {
      client: "Colliers International",
      deliverable: "Growth & Storytelling Layouts",
      goal: "Elevate APAC Brand Presentation",
      tools: ["Figma", "Illustrator"]
    };
  }

  if (title.includes('customer-focused') || title.includes('results-driven')) {
    return {
      client: "Mindtickle",
      deliverable: "Promo Motion Sequence",
      goal: "Drive high-impact digital media conversions",
      tools: ["After Effects", "Premiere"]
    };
  }

  if (title.includes('ey ') || title.includes('advisory brand')) {
    return {
      client: "Ernst & Young LLP",
      deliverable: "Digital Advisory Brand Campaigns",
      goal: "Foster advisory authority through visual guidelines",
      tools: ["Illustrator", "Photoshop"]
    };
  }

  if (title.includes('kpmg')) {
    return {
      client: "KPMG",
      deliverable: "Corporate Pitch Systems",
      goal: "Enhance proposal appeal and win-rates for international bids",
      tools: ["Illustrator", "InDesign"]
    };
  }

  if (title.includes('creative brand') || title.includes('visual assets')) {
    return {
      client: "SaaS Startup",
      deliverable: "Brand Identity & Visual Assets",
      goal: "Accelerate market authority with polished design systems",
      tools: ["Figma", "Illustrator"]
    };
  }

  return {
    client: "Visual Studies",
    deliverable: "Photography Grid",
    goal: "Explore structural form, contrast & balance",
    tools: ["Photoshop"]
  };
};

const toolIcons = {
  "Figma": TbBrandFigma,
  "Illustrator": TbBrandAdobeIllustrator,
  "After Effects": TbBrandAdobeAfterEffect,
  "Premiere": TbBrandAdobePremier,
  "Photoshop": TbBrandAdobePhotoshop,
  "InDesign": TbBrandAdobeIndesign
};

const toolSvgs = {
  "Figma": "/icons/figma.svg",
  "Illustrator": "/icons/illustrator.svg",
  "After Effects": "/icons/after-effects.svg",
  "Premiere": "/icons/premiere.svg",
  "Photoshop": "/icons/photoshop.svg",
  "InDesign": "/icons/indesign.svg"
};

const getAssetData = (filename) => {
  let category = 'Brand Systems'
  if (filename.includes('Colliers') || filename.includes('KPMG')) {
    category = 'Editorial'
  } else if (filename.endsWith('.gif') || filename.endsWith('.mp4') || filename.endsWith('.GIF') || filename.endsWith('.MP4')) {
    category = 'Motion'
  }

  const data = assetMetadata[filename] || assetMetadata[decodeURIComponent(filename)]
  if (data) {
    return { ...data, category }
  }

  const cleanTitle = filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
  const formatted = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1).toLowerCase()
  return {
    title: formatted,
    subtitle: "Digital Design // Brand Identity",
    impact: "Visual Identity System",
    category
  }
}

// Dynamically import all design pngs/webps
const pngModules = import.meta.glob('./assets/pngs/*.{png,webp,jpeg,jpg,PNG,WEBP,JPEG,JPG}', { eager: true })
const pngWorks = Object.keys(pngModules).map((path, idx) => {
  const filename = path.split('/').pop()
  const meta = getAssetData(filename)
  const details = getProjectDetails({ ...meta, id: `png-${idx}` })

  return {
    id: `png-${idx}`,
    title: details.titleOverride || meta.title,
    subtitle: meta.subtitle,
    impact: meta.impact,
    category: meta.category,
    company: details.client,
    deliverable: details.deliverable,
    goal: details.goal,
    tools: (details.tools || []).map(t => ({ name: t, iconPath: toolSvgs[t] })),
    image: pngModules[path].default || pngModules[path],
    type: 'png'
  }
})

// Dynamically import all motion gifs/mp4s
const gifModules = import.meta.glob('./assets/gifs/*.{gif,mp4,GIF,MP4}', { eager: true })
const gifWorks = Object.keys(gifModules).map((path, idx) => {
  const filename = path.split('/').pop()
  const meta = getAssetData(filename)
  const details = getProjectDetails({ ...meta, id: `gif-${idx}` })

  return {
    id: `gif-${idx}`,
    title: details.titleOverride || meta.title,
    subtitle: meta.subtitle,
    impact: meta.impact,
    category: meta.category,
    company: details.client,
    deliverable: details.deliverable,
    goal: details.goal,
    tools: (details.tools || []).map(t => ({ name: t, iconPath: toolSvgs[t] })),
    image: gifModules[path].default || gifModules[path],
    type: 'gif'
  }
})

const allWorkItems = [...gifWorks, ...pngWorks]

// Social & Contact links config
const socialLinks = [
  {
    label: "Adobe Stock",
    url: "https://stock.adobe.com/in/contributor/210907448/Manoj",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M15.1 2H24v20L15.1 2zM8.9 2H0v20L8.9 2zM12 9.4L17.6 22h-3.8l-1.6-4H8.1L12 9.4z" /></svg>
    )
  },
  {
    label: "Instagram",
    url: "https://www.instagram.com/manoj__manohar/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
    )
  },
  {
    label: "Pexels",
    url: "https://www.pexels.com/@manojmanohar/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M1.216 0C.544 0 0 .544 0 1.216v21.568C0 23.456.544 24 1.216 24h21.568c.672 0 1.216-.544 1.216-1.216V1.216C24 .544 23.456 0 22.784 0H1.216zM6.92 5.86h5.811c3.559 0 5.4 1.986 5.4 4.887 0 2.946-2.072 5.086-5.4 5.086h-2.12v2.307H6.92V5.86zm3.69 2.871v4.22h1.614c1.879 0 2.257-1.36 2.257-2.11 0-.75-.378-2.11-2.257-2.11H10.61z" /></svg>
    )
  },
  {
    label: "Email",
    url: "mailto:manojvickie@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 4L12 13 2 4" /></svg>
    )
  },
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/manojmano/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
    )
  },
  {
    label: "Behance",
    url: "https://www.behance.net/manojmanoharan",
    icon: <SiBehance className="w-5 h-5" />
  },
  {
    label: "WhatsApp",
    url: "https://wa.me/+917092052357",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11.42 0H11.4C5.11 0 0 5.11 0 11.4c0 1.99.52 3.86 1.44 5.48L0 22.84l6.14-1.42c1.58.87 3.39 1.36 5.28 1.36h.02c6.29 0 11.4-5.11 11.4-11.4C22.84 5.11 17.73 0 11.42 0zm0 20.89c-1.68 0-3.32-.45-4.75-1.3l-.34-.2-3.53.82.84-3.44-.22-.35A9.45 9.45 0 011.96 11.4c0-5.24 4.26-9.5 9.5-9.5 5.24 0 9.5 4.26 9.5 9.5 0 5.24-4.26 9.5-9.5 9.5zm5.22-7.14c-.29-.14-1.7-.84-1.96-.94-.26-.09-.45-.14-.64.14-.19.29-.74.94-.91 1.13-.17.19-.34.21-.63.07-.29-.14-1.21-.45-2.31-1.43-.85-.76-1.42-1.7-1.59-1.99-.17-.29-.02-.45.12-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.11-.23-.55-.47-.48-.64-.49-.17 0-.36-.01-.55-.01-.19 0-.5.07-.76.36-.26.29-.98.96-.98 2.34 0 1.38 1 2.71 1.14 2.9.14.19 1.98 3.02 4.79 4.24.67.29 1.19.46 1.6.59.67.21 1.28.18 1.76.11.53-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.33z" /></svg>
    )
  },
  {
    label: "Phone",
    url: "tel:+917092052357",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
    )
  }
]

const ProjectDetailPanel = ({ project }) => {
  return (
    <div className="flex flex-col p-8 backdrop-blur-lg bg-white/90 dark:bg-black/90 text-black dark:text-white rounded-xl border border-black/10 dark:border-white/10 shadow-2xl text-left pointer-events-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Labels & Values */}
        <div className="space-y-4">
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">Company</h4>
            <p className="text-sm font-semibold">{project.company}</p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">Deliverable</h4>
            <p className="text-sm font-semibold">{project.deliverable}</p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">Business Goal</h4>
            <p className="text-sm italic text-gray-400">{project.goal}</p>
          </div>
        </div>
        
        {/* Right Side: Tool Logos */}
        <div className="flex flex-col h-full">
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-4">Tools</h4>
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
                    <span className="text-[10px] font-mono border border-black/10 dark:border-white/10 px-1.5 py-0.5 rounded uppercase tracking-widest">{tool.name}</span>
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

function App() {
  const { personal, roadmap } = portfolioData
  const [activeTab, setActiveTab] = useState('All') // 'All', 'Motion', 'Brand Systems', 'Editorial'

  // Theme state
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark'); // Strip dark mode class
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');    // Apply dark mode class
    }
  }, [theme])

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 9

  // Custom cursor position and hover states using Framer Motion springs (liquid trailing physics)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const cursorXSpring = useSpring(cursorX, { damping: 25, stiffness: 700, mass: 0.5 })
  const cursorYSpring = useSpring(cursorY, { damping: 25, stiffness: 700, mass: 0.5 })

  const [cursorHovered, setCursorHovered] = useState(false)
  const [cursorMode, setCursorMode] = useState('default') // 'default', 'close'
  const [hoveredWorkId, setHoveredWorkId] = useState(null)


  // Lightbox selection state
  const [selectedWork, setSelectedWork] = useState(null)

  // Accordion state for Experience
  const [activeIndex, setActiveIndex] = useState(null)

  // Lenis ref for scrolling control
  const lenisRef = useRef(null)

  // Ref array for tracking experience items for smart scroll calculation
  const itemRefs = useRef([])

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1.5,
    })

    lenisRef.current = lenis

    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  // Reset page index on tab change
  useEffect(() => {
    setCurrentPage(0)
  }, [activeTab])

  // Temporarily disable Lenis and normal window scrolling when modal is active
  useEffect(() => {
    if (lenisRef.current) {
      if (selectedWork) {
        lenisRef.current.stop()
        document.body.style.overflow = 'hidden'
      } else {
        lenisRef.current.start()
        document.body.style.overflow = ''
      }
    }
  }, [selectedWork])

  // Follow pointer coordinate logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [cursorX, cursorY])

  // Velocity-based scroll skew transform for Work and Photography grids
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const skewSpring = useSpring(scrollVelocity, { damping: 45, stiffness: 250 })
  const skewY = useTransform(skewSpring, [-3000, 3000], [-6, 6])

  const filteredWork = allWorkItems.filter(item => {
    if (activeTab === 'All') return true
    return item.category === activeTab
  })

  const totalPages = Math.ceil(filteredWork.length / itemsPerPage)
  const paginatedWork = filteredWork.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  return (
    <>
      <Preloader />
      {/* 1. Custom Liquid Difference Cursor */}
      <motion.div
        className={`cursor-dot ${cursorHovered || cursorMode === 'close' ? 'hovered' : ''} flex items-center justify-center pointer-events-none fixed z-[9999] bg-white`}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%'
        }}
      >
        <AnimatePresence>
          {cursorMode === 'close' && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="text-[11px] font-mono tracking-widest text-black font-black uppercase pointer-events-none select-none"
            >
              Close
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 7. Cinematic Lightbox Modal */}
      <GlobalImageModal
        isOpen={!!selectedWork}
        onClose={() => {
          setSelectedWork(null)
          setCursorMode('default')
          setCursorHovered(false)
        }}
        onMouseEnter={() => {
          setCursorMode('close')
          setCursorHovered(true)
        }}
        onMouseLeave={() => {
          setCursorMode('default')
          setCursorHovered(false)
        }}
      >
        {selectedWork && (
          selectedWork.id.startsWith('photo-') ? (
            <div 
              className="relative flex flex-col items-center bg-black w-full"
              onMouseEnter={() => {
                setCursorMode('default')
                setCursorHovered(false)
              }}
              onMouseLeave={() => {
                setCursorMode('close')
                setCursorHovered(true)
              }}
            >
              <img 
                src={selectedWork.image} 
                alt={selectedWork.title} 
                className="w-full h-auto max-h-[70vh] object-contain bg-black" 
              />
              <div className="p-6 text-center text-white w-full bg-neutral-900 border-t border-neutral-800">
                <h4 className="text-white font-semibold text-lg mb-1">
                  {selectedWork.title}
                </h4>
                <p className="text-gray-400 text-sm">
                  Photography &bull; Visual studies
                </p>
              </div>
            </div>
          ) : (
            <div 
              className="relative flex flex-col gap-0 bg-black w-full"
              onMouseEnter={() => {
                setCursorMode('default')
                setCursorHovered(false)
              }}
              onMouseLeave={() => {
                setCursorMode('close')
                setCursorHovered(true)
              }}
            >
              {selectedWork.image.endsWith('.mp4') ? (
                <video
                  src={selectedWork.image}
                  playsInline
                  autoPlay
                  loop
                  muted
                  preload="auto"
                  className="block align-bottom border-none w-full h-auto max-h-[60vh] object-contain bg-black"
                />
              ) : (
                <img 
                  src={selectedWork.image} 
                  alt={selectedWork.title} 
                  className="block align-bottom border-none w-full h-auto max-h-[60vh] object-contain bg-black" 
                />
              )}
              <ProjectDetailPanel project={selectedWork} />
            </div>
          )
        )}
      </GlobalImageModal>

      {window.location.pathname === '/photography' ? (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center font-mono text-white">Loading archive...</div>}>
          <PhotographyArchive 
            jpegs={jpegs} 
            setCursorHovered={setCursorHovered} 
            setSelectedWork={setSelectedWork} 
          />
        </Suspense>
      ) : (
      <div className="relative min-h-screen text-white font-sans bg-black selection:bg-white selection:text-black overflow-hidden will-change-transform">

        {/* 2. Glowing Atmospheric Background Layer */}
        <div className="fixed inset-0 bg-black -z-50 overflow-hidden pointer-events-none">
          {/* Soft violet light leak top-left */}
          <div
            className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] rounded-full blur-[150px] opacity-15 mix-blend-screen animate-leak-one"
            style={{
              background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, rgba(91,33,182,0.04) 60%, rgba(0,0,0,0) 100%)'
            }}
          />

          {/* Muted crimson leak bottom-right */}
          <div
            className="absolute -bottom-[15%] -right-[10%] w-[60vw] h-[60vw] rounded-full blur-[130px] opacity-12 mix-blend-screen animate-leak-two"
            style={{
              background: 'radial-gradient(circle, rgba(220,38,38,0.14) 0%, rgba(153,27,27,0.03) 50%, rgba(0,0,0,0) 100%)'
            }}
          />

          {/* Ambient amber leak center-right */}
          <div
            className="absolute top-[30%] -right-[5%] w-[45vw] h-[45vw] rounded-full blur-[140px] opacity-10 mix-blend-screen animate-leak-three"
            style={{
              background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, rgba(180,83,9,0.01) 70%, rgba(0,0,0,0) 100%)'
            }}
          />
        </div>

        {/* 3. SVG Grain Layer Overlay */}
        <div className="pointer-events-none fixed inset-0 z-40 w-full h-full opacity-[0.03] mix-blend-normal">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.8 0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>

        {/* Main Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-6 md:py-10">

          {/* Global Header */}
          <header className="flex justify-end items-center mb-10 md:mb-16">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center gap-2 font-mono text-sm tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-none focus:outline-none"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
            </button>
          </header>

          {/* Hero Section (Split Screen Architecture) */}
          <section className="w-full relative bg-black overflow-hidden pb-0 mb-0">
            <div className="grid grid-cols-1 md:grid-cols-2 h-full gap-12 md:gap-8">

              {/* Left Column (Typography) */}
              <div className="flex flex-col justify-center items-start space-y-8 z-10 relative h-full text-left order-1 pt-24 md:pt-0 pr-4 md:pr-16 lg:pr-20">
                <h1 className="text-white text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-none tracking-tight">
                  Shaping<br />
                  global<br />
                  narratives.
                </h1>

                <p className={`text-lg md:text-xl max-w-md leading-relaxed ${theme === 'light' ? 'text-black' : 'text-gray-300'}`}>
                  I am a creative strategist dedicated to crafting impactful visual systems that simplify complex ideas and drive meaningful engagement. I help brands turn their core values into compelling stories that resonate with their audiences.
                </p>

                <div className="flex space-x-4">
                  <a
                    href="#works"
                    onClick={(e) => {
                      e.preventDefault()
                      lenisRef.current?.scrollTo('#works')
                    }}
                    onMouseEnter={() => setCursorHovered(true)}
                    onMouseLeave={() => setCursorHovered(false)}
                    className="bg-white text-black px-6 py-3 font-medium hover:bg-gray-200 transition-colors inline-block hero-btn-primary cursor-none"
                  >
                    Explore work
                  </a>
                  <a
                    href={cvPdf}
                    download="Manoj_Manoharan_CV.pdf"
                    onMouseEnter={() => setCursorHovered(true)}
                    onMouseLeave={() => setCursorHovered(false)}
                    className="border border-white text-white px-6 py-3 font-medium hover:bg-white hover:text-black transition-colors inline-block hero-btn-secondary cursor-none"
                  >
                    Download CV
                  </a>
                </div>
              </div>

              {/* Right Column (Portrait Image) */}
              <div className="relative h-[50vh] md:h-full w-full order-2 bg-black overflow-hidden flex justify-center items-end will-change-transform pb-0 mb-0">
                {/* Isolated Portrait in grayscale */}
                <img
                  src={heroPortrait}
                  alt="Manoj Manoharan"
                  decoding="async"
                  className={`block object-cover object-bottom h-full m-0 relative z-0 pointer-events-none select-none transition-all duration-500 ${theme === 'dark' ? 'grayscale' : 'grayscale-0'
                    }`}
                />
              </div>

            </div>
          </section>

          {/* Section divider */}
          <div className="w-full h-[2px] min-h-[2px] bg-black-mm dark:bg-white/20 block"></div>

          {/* Selected Work Section (Visual Masonry Grid) */}
          <section id="works" className="mt-16 md:mt-24 lg:mt-32 mb-40 md:mb-56">
            <div className="sticky top-0 z-40 bg-transparent backdrop-blur-md border-b border-black/10 dark:border-white/10 py-4 flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div>
                <span className="font-sans text-neutral-600 dark:text-neutral-400 text-xs font-semibold tracking-widest block mb-3">
                  Selected portfolios
                </span>
                <h2
                  className={`font-sans text-3xl md:text-5xl font-bold tracking-tight ${theme === 'light' ? 'text-black' : 'text-white'}`}
                  style={{ WebkitTextFillColor: 'unset', WebkitTextStroke: '0px' }}
                >
                  Selected Work
                </h2>
              </div>

              {/* Mobile Filter Dropdown */}
              <div className="block md:hidden w-full mb-10 relative font-mono">
                <select 
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="appearance-none bg-transparent border-b border-gray-500 text-white font-medium py-2 pr-8 focus:outline-none focus:ring-0 cursor-pointer w-full uppercase tracking-wider text-sm"
                >
                  <option value="All" className="bg-black text-white">All</option>
                  <option value="Motion" className="bg-black text-white">Motion</option>
                  <option value="Brand Systems" className="bg-black text-white">Brand Systems</option>
                  <option value="Editorial" className="bg-black text-white">Editorial</option>
                </select>
                {/* Custom Dropdown Arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>

              {/* Desktop Filter Tabs */}
              <div className="hidden md:flex flex-wrap gap-3 font-mono">
                {[
                  { id: 'All', label: 'All' },
                  { id: 'Motion', label: 'Motion' },
                  { id: 'Brand Systems', label: 'Brand Systems' },
                  { id: 'Editorial', label: 'Editorial' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-5 py-2 rounded-full border text-[11px] uppercase tracking-widest transition-all duration-300 cursor-none focus:outline-none ${
                      activeTab === tab.id
                        ? theme === 'light'
                          ? 'bg-black text-white border-black'
                          : 'dark:bg-white dark:text-black dark:border-white'
                        : theme === 'light'
                          ? 'bg-transparent text-black border-black hover:bg-black hover:text-white'
                          : 'bg-transparent text-gray-400 border-white/20 hover:border-white hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual-First Selected Work Gallery (Aligned Grid with Page Transitions) */}
            <div className="relative min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentPage}-${activeTab}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 overflow-hidden md:overflow-visible max-h-[calc(2*50vw+1.5rem)] md:max-h-none transition-all duration-500 ${
                    selectedWork && !selectedWork.id.startsWith('photo-') ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
                  }`}
                >
                  {paginatedWork.map((item, index) => {
                    const isHovered = hoveredWorkId === item.id
                    const isAnyHovered = hoveredWorkId !== null
                    const isSibling = isAnyHovered && !isHovered

                    return (
                      <ZoomWrapper
                        key={item.id}
                        style={{ skewY }}
                        onMouseEnter={() => setCursorHovered(true)}
                        onMouseLeave={() => setCursorHovered(false)}
                        onClick={() => setSelectedWork(item)}
                        className="text-left flex flex-col h-full group cursor-none select-none relative will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-4 dark:focus-visible:ring-offset-black focus-visible:ring-offset-white"
                      >
                        <div
                          className="w-full aspect-[3/4] md:aspect-[4/3] relative overflow-hidden rounded bg-neutral-950 border border-neutral-900 group-hover:border-neutral-800 transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_rgba(255,255,255,0.05)] will-change-transform"
                        >
                           {item.image.endsWith('.mp4') ? (
                            <video
                              src={item.image}
                              playsInline
                              autoPlay
                              loop
                              muted
                              preload="auto"
                              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-105"
                            />
                          ) : (
                            <img
                              src={item.image}
                              alt={item.title}
                              decoding="async"
                              loading="lazy"
                              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-105"
                            />
                          )}
                        </div>

                        <div className="mt-2 md:mt-4 flex flex-col flex-grow">
                          <div className="hidden md:flex justify-between items-baseline gap-4 mb-2">
                            <h3 className="font-serif text-lg font-bold text-white tracking-tight group-hover:text-neutral-200 transition-colors line-clamp-2">
                              {item.title}
                            </h3>
                            <span className="font-mono text-[11px] text-neutral-600 dark:text-neutral-400 tracking-wider shrink-0">
                              {item.impact}
                            </span>
                          </div>
                          <div className="hidden md:flex mt-auto justify-between items-center text-xs font-mono text-neutral-600 dark:text-neutral-400 pt-2 border-t border-neutral-900/50">
                            <span>{item.subtitle}</span>
                            <span className="text-neutral-500 dark:text-neutral-500">
                              {(currentPage * itemsPerPage + index + 1) < 10
                                ? `0${currentPage * itemsPerPage + index + 1}`
                                : currentPage * itemsPerPage + index + 1}
                            </span>
                          </div>
                          <span className="text-[11px] md:text-xs uppercase tracking-widest font-bold mt-2 md:mt-4 block text-neutral-500 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                            {item.image.endsWith('.mp4') ? 'Play ▶' : 'View ↗'}
                          </span>
                        </div>
                      </ZoomWrapper>
                    )
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Brutalist Editorial Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-16 pt-8 border-t border-neutral-900 font-mono text-xs select-none">
                <button
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  onMouseEnter={() => setCursorHovered(true)}
                  onMouseLeave={() => setCursorHovered(false)}
                  className={`hover-link-underline pb-1 tracking-wider transition-all duration-300 cursor-none ${currentPage === 0
                    ? 'opacity-25 pointer-events-none text-neutral-700'
                    : 'text-white hover:text-neutral-300'
                    }`}
                >
                  &larr; Prev
                </button>

                <span className="text-neutral-600 dark:text-neutral-400 tracking-wider">
                  Page {(currentPage + 1) < 10 ? `0${currentPage + 1}` : currentPage + 1} of {totalPages < 10 ? `0${totalPages}` : totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages - 1}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  onMouseEnter={() => setCursorHovered(true)}
                  onMouseLeave={() => setCursorHovered(false)}
                  className={`hover-link-underline pb-1 tracking-wider transition-all duration-300 cursor-none ${currentPage === totalPages - 1
                    ? 'opacity-25 pointer-events-none text-neutral-700'
                    : 'text-white hover:text-neutral-300'
                    }`}
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </section>


          {/* Experience Section */}
          <section id="roadmap" className="relative pt-20 mb-40 md:mb-56">
            <div className="sticky top-0 z-50 bg-transparent backdrop-blur-md border-b border-black/10 dark:border-white/10 w-full py-6 mb-24 flex flex-col justify-end">
              <span className="font-sans text-neutral-600 dark:text-neutral-400 text-xs font-semibold tracking-widest block mb-3">
                Professional trajectory
              </span>
              <h2
                className={`font-sans text-3xl md:text-5xl font-bold tracking-tight ${theme === 'light' ? 'text-black' : 'text-white'}`}
                style={{ WebkitTextFillColor: 'unset', WebkitTextStroke: '0px' }}
              >
                Experience
              </h2>
            </div>

            {/* Typographic List with Hover-revealed roles */}
            <div className="flex flex-col border-t border-neutral-900">
              {roadmap.map((item, index) => {
                const isActive = activeIndex === index
                return (
                  <div
                    key={index}
                    ref={(el) => (itemRefs.current[index] = el)}
                    onMouseEnter={() => {
                      setCursorHovered(true);
                      if (window.innerWidth >= 768) {
                        setActiveIndex(index); // Expand on hover for desktop
                      }
                    }}
                    onMouseLeave={() => {
                      setCursorHovered(false);
                      if (window.innerWidth >= 768) {
                        setActiveIndex(null); // Collapse on leave for desktop
                      }
                    }}
                    onClick={() => {
                      // Execute click-to-expand and auto-scroll ONLY on mobile
                      if (window.innerWidth < 768) {
                        const isOpening = activeIndex !== index;
                        const element = itemRefs.current[index];
                        
                        setActiveIndex(isOpening ? index : null);

                        if (isOpening && element) {
                          const handleTransitionEnd = (e) => {
                            if (e.target !== element.querySelector('.accordion-content')) return;
                            const rect = element.getBoundingClientRect();
                            const viewportHeight = window.innerHeight;

                            if (rect.bottom > viewportHeight) {
                              const hiddenAmount = rect.bottom - viewportHeight + 40;
                              window.scrollBy({ top: hiddenAmount, behavior: 'smooth' });
                            } else {
                              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                            element.removeEventListener('transitionend', handleTransitionEnd);
                          };
                          element.addEventListener('transitionend', handleTransitionEnd);
                        }
                      }
                    }}
                    className="border-b border-neutral-900 py-10 md:py-14 cursor-none select-none scroll-mt-24 md:scroll-mt-32"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <h3 className="font-serif text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-neutral-500 hover:text-white transition-colors duration-300 leading-none">
                        {item.company}
                      </h3>
                      <span className="font-mono text-sm text-neutral-600 dark:text-neutral-400 tracking-wider">{item.duration}</span>
                    </div>

                    {/* Sharp Details Reveal on Click */}
                    <div
                      className={`accordion-content overflow-hidden transition-all duration-[350ms] ease-in-out ${
                        isActive ? 'max-h-[1000px] opacity-100 mt-8 pt-8 border-t border-neutral-900/50' : 'max-h-0 opacity-0 mt-0 pt-0 border-t-0 border-transparent'
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-4">
                          <span className="font-mono text-sm text-neutral-600 dark:text-neutral-400 tracking-wider block mb-1">Role Title</span>
                          <span className="text-white text-lg font-serif font-bold italic">{item.role}</span>
                        </div>

                        <div className="md:col-span-8">
                          <span className="font-mono text-sm text-neutral-600 dark:text-neutral-400 tracking-wider block mb-1">Focus & Responsibility</span>
                          <p className="text-neutral-400 text-sm font-light leading-relaxed max-w-2xl mb-6">
                            {item.description}
                          </p>

                          <div className="space-y-2">
                            <span className="font-mono text-sm text-neutral-600 dark:text-neutral-400 uppercase tracking-widest block mb-1">Key Outcomes</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {item.achievements.map((bullet, i) => (
                                <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-300 font-light">
                                  <span className="mt-1.5 h-1.5 w-1.5 bg-neutral-700 shrink-0" />
                                  <span>{bullet}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>


          {/* 5. Lens / Visual Studies Section (Clean 3-Column Photography Grid with Lightbox) */}
          <Suspense fallback={<div className="h-48 w-full flex items-center justify-center font-mono text-xs text-neutral-600 dark:text-neutral-400">Loading visual studies...</div>}>
            <LensSection
              jpegs={jpegs.slice(0, 8)}
              skewY={skewY}
              setCursorHovered={setCursorHovered}
              setSelectedWork={setSelectedWork}
            />
          </Suspense>
          <div className="flex justify-center mt-12 mb-20">
            <button 
              onClick={() => window.location.pathname = '/photography'}
              className="px-8 py-3 border border-white/20 hover:border-white text-white font-mono uppercase tracking-widest text-sm transition-all cursor-none"
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
            >
              View Visual Archive
            </button>
          </div>

          {/* 6. Contact & Socials Footer (Brutalist Grid Directory) */}
          <Suspense fallback={<div className="h-48 w-full flex items-center justify-center font-mono text-xs text-neutral-600 dark:text-neutral-400">Loading social directory...</div>}>
            <SocialDirectory
              socialLinks={socialLinks}
              setCursorHovered={setCursorHovered}
            />
          </Suspense>

          {/* Footer info */}
          <footer className="text-center font-mono text-xs text-neutral-600 dark:text-neutral-400 pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4 tracking-wider">
            <span>&copy; {new Date().getFullYear()} {personal.name} &bull; Editorial Space</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>Online studio space</span>
            </span>
          </footer>

        </div>

      </div>
      )}
      <BackToTop />
    </>
  )
}

export default App
