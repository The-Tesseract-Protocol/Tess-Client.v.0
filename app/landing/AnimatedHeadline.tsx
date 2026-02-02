"use client" 
import { useEffect, useState, useRef } from 'react';

interface AnimatedHeadlineProps {
  text: string;
  className?: string;
  delay?: number;
}

interface LetterWithDelay {
  letter: string;
  index: number;
  delay: number;
}

export const AnimatedHeadline = ({ text, className = '', delay = 0 }: AnimatedHeadlineProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [lettersWithDelays, setLettersWithDelays] = useState<LetterWithDelay[]>([]);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLettersWithDelays(text.split('').map((letter, index) => ({
      letter,
      index,
      delay: Math.random() * 0.8
    })));
  }, [text]);

  // Initial render safe placeholder or empty
  if (lettersWithDelays.length === 0) {
      // Return invisible text to avoid layout shift if possible, or just null
      return <span ref={ref} className={`inline-block ${className} opacity-0`}>{text}</span>;
  }

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {lettersWithDelays.map(({ letter, index, delay: randomDelay }) => {
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
