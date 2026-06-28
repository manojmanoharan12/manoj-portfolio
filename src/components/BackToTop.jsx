import { useState, useEffect } from 'react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => window.scrollY > 500 ? setIsVisible(true) : setIsVisible(false);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className={`fixed bottom-8 right-8 z-50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <button 
        onClick={scrollToTop}
        className="group relative w-32 h-12 overflow-hidden border-none bg-transparent cursor-pointer text-black dark:text-white flex items-center focus:outline-none"
      >
        {/* Animated Underline */}
        <span className="absolute h-[2px] bottom-0 left-0 w-full bg-black dark:bg-white scale-x-0 origin-bottom-right transition-transform duration-250 ease-out group-hover:scale-x-100 group-hover:origin-bottom-left"></span>
        
        {/* Original Text */}
        <div className="absolute w-full h-full flex items-center text-xs uppercase tracking-widest font-bold">
          <span className="transition-all duration-200 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:-translate-y-[60px] opacity-100 ml-1">T</span>
          <span className="transition-all duration-200 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:-translate-y-[60px] opacity-100 ml-1">O</span>
          <span className="transition-all duration-200 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:-translate-y-[60px] opacity-100 ml-1">P</span>
        </div>

        {/* Cloned Text (Rolls up on hover) */}
        <div className="absolute w-full h-full flex items-center text-xs uppercase tracking-widest font-bold">
          <span className="translate-y-[60px] transition-all duration-200 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:translate-y-0 opacity-100 ml-1 delay-[150ms]">T</span>
          <span className="translate-y-[60px] transition-all duration-200 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:translate-y-0 opacity-100 ml-1 delay-[200ms]">O</span>
          <span className="translate-y-[60px] transition-all duration-200 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:translate-y-0 opacity-100 ml-1 delay-[250ms]">P</span>
        </div>

        {/* Icon */}
        <svg 
          className="absolute w-4 right-2 top-1/2 -translate-y-1/2 -rotate-45 transition-transform duration-200 ease-out group-hover:-rotate-90" 
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>
  );
}
