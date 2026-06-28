import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const GlobalImageModal = ({ isOpen, onClose, children, ...props }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-12 cursor-none"
        onClick={onClose}
        {...props}
      >
        <div
          className="relative w-full max-w-4xl bg-white/90 dark:bg-black/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
