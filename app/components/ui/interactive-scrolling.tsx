"use client";
import React, { useState, useEffect, useRef, SyntheticEvent } from 'react';
import { useLenis } from 'lenis/react';

// --- Data for each slide ---
const slidesData = [
  {
    title: "Private Deposits",
    description: "Deposit funds into a shared pool with a private withdrawal secret only you control. Your deposit is verified on-chain, but your identity is never exposed — giving you full authority over your funds.",
    image: "Deposit.png",
    bgColor: "#F5E7C6",
    textColor: "#000000",
  },
  {
    title: "End-to-End Encryption",
    description: "Your payment instructions are protected by dual-layer encryption. Each party in the process only sees what they need to — no single entity ever has the full picture of your transaction.",
    image: "key.png",
    bgColor: "#F5E7C6",
    textColor: "#000000",
  },
  {
    title: "Confidential Distribution",
    description: "Your recipients get paid without any traceable link back to you. Payments settle on-chain for trust and finality, but the connection between sender and receiver stays completely private.",
    image: "distribution.png",
    bgColor: "#F5E7C6",
    textColor: "#000000",
  },
  {
    title: "Bulk Payments",
    description: "Pay hundreds of recipients in one go with a single authorization. Built for payroll, vendor settlements, and large-scale distributions — all with the same level of confidentiality.",
    image: "bulk.png",
    bgColor: "#F5E7C6",
    textColor: "#000000",
  },
];

// --- Main App Component ---
const ScrollingFeatureShowcase = () => {
  // State to track the currently active slide index
  const [activeIndex, setActiveIndex] = useState(0);
  // State to track if scroll should be locked (for internal scrolling)
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  // Ref to the main section element
  const sectionRef = useRef<HTMLElement>(null);
  // Ref to the main scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Ref to the sticky content panel
  const stickyPanelRef = useRef<HTMLDivElement>(null);

  // Access Lenis instance to stop/start smooth scrolling
  const lenis = useLenis();

  // --- Stop/Start Lenis based on scroll lock state ---
  useEffect(() => {
    if (!lenis) return;

    if (isScrollLocked) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [isScrollLocked, lenis]);

  // --- Scroll Handler for internal container (updates active slide index) ---
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollableHeight = container.scrollHeight - window.innerHeight;
      const stepHeight = scrollableHeight / slidesData.length;
      const newActiveIndex = Math.min(
        slidesData.length - 1,
        Math.floor(container.scrollTop / stepHeight)
      );
      setActiveIndex(newActiveIndex);
    };

    container.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // --- SCROLL LOCK: Handle internal scroll when section is at top ---
  useEffect(() => {
    const container = scrollContainerRef.current;
    const section = sectionRef.current;
    if (!container || !section) return;

    // Calculate the scroll position where section should lock
    const getSectionLockPosition = () => {
      const rect = section.getBoundingClientRect();
      return window.scrollY + rect.top;
    };

    const handleWheel = (e: WheelEvent) => {
      const rect = section.getBoundingClientRect();
      const scrollableHeight = container.scrollHeight - window.innerHeight;
      const isAtEnd = container.scrollTop >= scrollableHeight - 10;
      const isAtStart = container.scrollTop <= 5;

      // Section is "locked" when its top is at or very near viewport top (sticky kicks in)
      // Use wider tolerance to catch when sticky is active
      const isLockedAtTop = rect.top <= 10 && rect.top >= -10;

      // Section is approaching but not yet at top - let user scroll naturally
      const isApproachingFromAbove = rect.top > 10 && rect.top < window.innerHeight;

      // Section has been scrolled past (user scrolled too fast) - need to snap back
      const hasScrolledPast = rect.top < -10 && rect.bottom > 0;

      // SCROLLING DOWN
      if (e.deltaY > 0) {
        // Section is approaching - let Lenis scroll naturally (NO INSTANT SNAP)
        if (isApproachingFromAbove) {
          // Don't intercept - let natural scroll bring it to top
          setIsScrollLocked(false);
          return;
        }

        // Section is locked at top - handle internal scroll
        if (isLockedAtTop && !isAtEnd) {
          e.preventDefault();
          e.stopPropagation();
          setIsScrollLocked(true);
          container.scrollTop += e.deltaY;
          return;
        }

        // Section has been scrolled past but internal scroll not complete - snap back smoothly
        if (hasScrolledPast && !isAtEnd) {
          e.preventDefault();
          e.stopPropagation();
          setIsScrollLocked(true);
          const lockPos = getSectionLockPosition();
          window.scrollTo({ top: lockPos, behavior: 'smooth' });
          container.scrollTop += Math.abs(e.deltaY);
          return;
        }

        // At end of internal scroll - allow page to continue
        if (isAtEnd) {
          setIsScrollLocked(false);
          return;
        }
      }

      // SCROLLING UP
      if (e.deltaY < 0) {
        // Section is locked - handle internal scroll if not at start
        if (isLockedAtTop && !isAtStart) {
          e.preventDefault();
          e.stopPropagation();
          setIsScrollLocked(true);
          container.scrollTop += e.deltaY;
          return;
        }

        // Section has been scrolled past - snap back smoothly and handle internal scroll
        if (hasScrolledPast && !isAtStart) {
          e.preventDefault();
          e.stopPropagation();
          setIsScrollLocked(true);
          const lockPos = getSectionLockPosition();
          window.scrollTo({ top: lockPos, behavior: 'smooth' });
          container.scrollTop += e.deltaY;
          return;
        }

        // At start of internal scroll - allow page to scroll back up
        if (isAtStart || isLockedAtTop) {
          setIsScrollLocked(false);
          return;
        }
      }
    };

    // Handle touch events for mobile
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      touchStartY = touchY;

      const rect = section.getBoundingClientRect();
      const scrollableHeight = container.scrollHeight - window.innerHeight;
      const isAtEnd = container.scrollTop >= scrollableHeight - 10;
      const isAtStart = container.scrollTop <= 5;
      const isLockedAtTop = rect.top <= 10 && rect.top >= -10;
      const isApproachingFromAbove = rect.top > 10 && rect.top < window.innerHeight;

      // Section approaching - let natural scroll continue
      if (isApproachingFromAbove && deltaY > 0) {
        setIsScrollLocked(false);
        return;
      }

      // Scrolling down, section locked, not at end
      if (deltaY > 0 && isLockedAtTop && !isAtEnd) {
        e.preventDefault();
        setIsScrollLocked(true);
        container.scrollTop += Math.abs(deltaY);
        return;
      }

      // Scrolling up, section locked, not at start
      if (deltaY < 0 && isLockedAtTop && !isAtStart) {
        e.preventDefault();
        setIsScrollLocked(true);
        container.scrollTop += deltaY;
        return;
      }

      // At boundaries - unlock
      setIsScrollLocked(false);
    };

    // Use capture phase to intercept before Lenis
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel, { capture: true });
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);
  
  // Dynamic styles for the background and text color transitions
  const dynamicStyles = {
    backgroundColor: slidesData[activeIndex].bgColor,
    color: slidesData[activeIndex].textColor,
    transition: 'background-color 0.7s ease, color 0.7s ease',
  };

  // Styles for the grid pattern on the right side
  const gridPatternStyle = {
    '--grid-color': 'rgba(0, 0, 0, 0.12)',
    backgroundImage: `
      linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
      linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)
    `,
    backgroundSize: '3.5rem 3.5rem',
  } as React.CSSProperties;

  return (
      <section
        ref={sectionRef}
        className="h-screen relative w-full sticky top-0 rounded-tr-2xl rounded-tl-2xl "
      >
      <div
        ref={scrollContainerRef}
        className="h-full w-full overflow-y-auto"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } as React.CSSProperties}
        // Prevent Lenis from interfering when we're handling internal scroll
        {...(isScrollLocked ? { 'data-lenis-prevent': true } : {})}
      >
        <div style={{ height: `${slidesData.length * 100}vh` }}>
        <div ref={stickyPanelRef} className="sticky top-0 h-screen w-full flex flex-col items-center justify-center" style={dynamicStyles}>
          <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full max-w-8xl mx-auto">
            
            {/* Left Column: Text Content, Pagination & Button */}
            <div className="relative flex flex-col justify-center p-8 md:p-16 ">
              {/* Pagination Bars */}
              <div className="absolute top-16 left-16 flex space-x-2">
                {slidesData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                        const container = scrollContainerRef.current;
                        if(container){
                            const scrollableHeight = container.scrollHeight - window.innerHeight;
                            const stepHeight = scrollableHeight / slidesData.length;
                            container.scrollTo({ top: stepHeight * index, behavior: 'smooth' });
                        }
                    }}
                    className={`h-1 rounded-full transition-all duration-500 ease-in-out ${
                      index === activeIndex ? 'w-12 bg-black/80' : 'w-6 bg-black/20'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              
              <div className="relative h-64 w-full">
                {slidesData.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      index === activeIndex
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-10'
                    }`}
                  >
                    <h2 className="text-5xl md:text-6xl font-bold tracking-tighter">{slide.title}</h2>
                    <p className="mt-6 text-lg md:text-xl max-w-md">{slide.description}</p>
                  </div>
                ))}
              </div>

              {/* Get Started Button */}
              <div className="absolute bottom-16 left-16">
                <a
                  href="/dashboard"
                  className="px-10 py-4 bg-black text-white font-semibold rounded-full uppercase tracking-wider hover:bg-gray-800 transition-colors"
                >
                  Launch App
                </a>
              </div>
            </div>

            {/* Right Column: Image Content with Grid Background */}
            <div className="hidden md:flex items-center justify-center p-8" style={gridPatternStyle}>
              <div className="relative w-[70%] h-[50vh] overflow-hidden">
                <div 
                  className="absolute top-0 left-0 w-full h-full transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateY(-${activeIndex * 100}%)` }}
                >
                  {slidesData.map((slide, index) => (
                    <div key={index} className="w-full h-full">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="h-[50%] object-contain"
                        onError={(e: SyntheticEvent<HTMLImageElement, Event>) => { 
                          const target = e.target as HTMLImageElement;
                          target.onerror = null; 
                          target.src = `https://placehold.co/800x1200/e2e8f0/4a5568?text=Image+Not+Found`; 
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

export default ScrollingFeatureShowcase;
