import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface AutoResetToastProps {
  isVisible: boolean;
  onReset: () => void;
  onCancel: () => void;
  duration?: number; // seconds
  message?: string;
}

export const AutoResetToast: React.FC<AutoResetToastProps> = ({
  isVisible,
  onReset,
  onCancel,
  duration = 10,
  message = "Transaction confirmed.",
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isVisible) {
      setTimeLeft(duration);
      setIsPaused(false);
    }
  }, [isVisible, duration]);

  useEffect(() => {
    if (!isVisible || isPaused || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onReset();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, isPaused, timeLeft, onReset]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-8 right-8 z-[100] bg-[#0A0A0A] border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-xl max-w-sm w-full"
        >
          <div className="flex items-start gap-4">
            <div className="relative pt-1">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div className="absolute inset-0 animate-ping opacity-20 rounded-full bg-green-400"></div>
            </div>
            
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-white mb-1">Success!</h4>
              <p className="text-xs text-white/60 mb-3 leading-relaxed">
                {message} Starting new session in <span className="text-white font-mono font-bold">{timeLeft}s</span>.
              </p>
              
              {/* Progress Bar */}
              <div className="h-1 w-full bg-white/10 rounded-full mb-3 overflow-hidden">
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: isPaused ? "100%" : "0%" }}
                  transition={{ duration: timeLeft > 0 ? timeLeft : 0, ease: "linear" }}
                  className="h-full bg-green-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onReset}
                  className="flex-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  Reset Now
                </button>
                <button
                  onClick={() => {
                    setIsPaused(true);
                    onCancel();
                  }}
                  className="flex-1 px-3 py-1.5 bg-transparent hover:bg-white/5 text-white/40 hover:text-white text-xs font-medium rounded-lg transition-colors border border-white/5 hover:border-white/10"
                >
                  Stay Here
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setIsPaused(true);
                onCancel();
              }}
              className="text-white/20 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
