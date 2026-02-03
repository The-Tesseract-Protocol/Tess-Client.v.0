import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './ChromaGrid.css';

export interface ChromaItem {
  image: string;
  title: string;
  subtitle: string;
  handle?: string;
  location?: string;
  borderColor?: string;
  gradient?: string;
  url?: string;
  quote?: string;
}

export interface ChromaGridProps {
  items?: ChromaItem[];
  className?: string;
}

export const ChromaGrid: React.FC<ChromaGridProps> = ({
  items,
  className = '',
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const demo: ChromaItem[] = [
    {
      image: 'https://i.pravatar.cc/300?img=8',
      title: 'Alex Rivera',
      subtitle: 'Full Stack Developer',
      borderColor: '#4F46E5',
      gradient: 'linear-gradient(145deg, #4F46E5, #000)',
      quote: "The scalability of this platform is unmatched. It's been a game changer for our team."
    },
    {
      image: 'https://i.pravatar.cc/300?img=11',
      title: 'Jordan Chen',
      subtitle: 'DevOps Engineer',
      borderColor: '#10B981',
      gradient: 'linear-gradient(210deg, #10B981, #000)',
      quote: "Seamless integration and robust security features. Highly recommended."
    },
    {
      image: 'https://i.pravatar.cc/300?img=3',
      title: 'Morgan Blake',
      subtitle: 'UI/UX Designer',
      borderColor: '#F59E0B',
      gradient: 'linear-gradient(165deg, #F59E0B, #000)',
      quote: "The design system is intuitive and beautiful. It makes building UIs a breeze."
    },
    {
      image: 'https://i.pravatar.cc/300?img=16',
      title: 'Casey Park',
      subtitle: 'Data Scientist',
      borderColor: '#EF4444',
      gradient: 'linear-gradient(195deg, #EF4444, #000)',
      quote: "Processing data has never been faster. A truly efficient tool for data analysis."
    }
  ];

  const originalData = items?.length ? items : demo;
  const shouldScroll = originalData.length > 3;
  
  // Only duplicate if we are scrolling
  const data = shouldScroll ? [...originalData, ...originalData, ...originalData] : originalData; 

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !shouldScroll) return;

    let ctx: gsap.Context;

    const setup = () => {
      ctx?.revert();
      ctx = gsap.context(() => {
        const firstCard = track.firstElementChild as HTMLElement;
        if (!firstCard) return;

        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        const itemWidth = firstCard.offsetWidth + gap;
        const oneSetWidth = itemWidth * originalData.length;

        // Reset position to 0 just in case
        gsap.set(track, { x: 0 });

        timelineRef.current = gsap.timeline({ repeat: -1 })
          .to(track, {
            x: -oneSetWidth,
            ease: "none",
            duration: 20 + (originalData.length * 2), // Adjust speed based on item count
          });
      }, trackRef);
    };

    setup();
    window.addEventListener('resize', setup);

    return () => {
      window.removeEventListener('resize', setup);
      ctx?.revert();
    };
  }, [originalData.length, shouldScroll]);

  const handleMouseEnter = () => {
    if (shouldScroll) {
      timelineRef.current?.pause();
    }
  };

  const handleMouseLeave = () => {
    if (shouldScroll) {
      timelineRef.current?.play();
    }
  };

  const handleCardClick = (url?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className={`chroma-carousel-container ${className} ${!shouldScroll ? 'static-grid' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`chroma-track ${!shouldScroll ? 'justify-center w-full' : ''}`} ref={trackRef}>
        {data.map((c, i) => (
          <article
            key={i}
            className="chroma-card"
            onClick={() => handleCardClick(c.url)}
            style={
              {
                '--card-gradient': c.gradient,
                cursor: c.url ? 'pointer' : 'default'
              } as React.CSSProperties
            }
          >
            <div className="chroma-content">
              <div className="chroma-header">
                <img src={c.image} alt={c.title} className="chroma-avatar" loading="lazy" />
                <div className="chroma-header-text">
                  <h3 className="name">{c.title}</h3>
                  <p className="role">{c.subtitle}</p>
                </div>
              </div>
              {c.quote && <p className="chroma-quote">{c.quote}</p>}
            </div>
          </article>
        ))}
      </div>
      {shouldScroll && <div className="chroma-side-fade left" />}
      {shouldScroll && <div className="chroma-side-fade right" />}
    </div>
  );
};

export default ChromaGrid;


