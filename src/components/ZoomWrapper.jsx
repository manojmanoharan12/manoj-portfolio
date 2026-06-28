import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ZoomWrapper = ({ children, className = '', ...props }) => {
  const [isHoverable, setIsHoverable] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover)');
    setIsHoverable(mediaQuery.matches);
    const handler = (e) => setIsHoverable(e.matches);
    
    // Add compatibility for older browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, []);

  return (
    <motion.div
      whileHover={isHoverable ? { scale: 1.05 } : {}}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`cursor-pointer overflow-hidden rounded-xl ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ZoomWrapper;
