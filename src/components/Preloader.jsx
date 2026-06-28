import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, animate } from 'framer-motion'

export default function Preloader() {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Tween counter state from 0 to 100 over exactly 1.8 seconds
    const controls = animate(0, 100, {
      duration: 1.8,
      ease: "linear",
      onUpdate: (value) => {
        setProgress(Math.floor(value))
      },
      onComplete: () => {
        setTimeout(() => {
          setIsComplete(true)
        }, 150) // brief buffer before unmounting
      }
    })

    return () => controls.stop()
  }, [])

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center overflow-hidden pointer-events-auto select-none"
        >
          <div className="flex flex-col items-center">
            {/* Centered Counter */}
            <span className="font-sans font-black text-6xl md:text-8xl text-white tracking-tighter tabular-nums select-none">
              {progress}%
            </span>

            {/* Sleek Minimal Progress Bar Container */}
            <div className="w-64 h-[2px] bg-white/20 mt-6 overflow-hidden rounded-full">
              {/* Active Indicator - Animated over exactly 1.8 seconds */}
              <motion.div 
                className="bg-white h-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ ease: "linear", duration: 1.8 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
