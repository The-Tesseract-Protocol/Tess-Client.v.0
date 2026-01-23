"use client" 
import { useEffect, useState, useRef, use } from 'react';

interface AnimatedHeadlineProps {
  text: string;
  className?: string;
  delay?: number;
}

export const AnimatedHeadline = ({ text, className = '', delay = 0 }: AnimatedHeadlineProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const letters = text.split('');

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {letters.map((letter, index) => {
        const randomDelay = Math.random() * 0.8;
        return (
          <span
            key={index}
            className="inline-block transition-all duration-500"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: isVisible ? `${randomDelay}s` : '0s',
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        );
      })}
    </span>
  );
};
