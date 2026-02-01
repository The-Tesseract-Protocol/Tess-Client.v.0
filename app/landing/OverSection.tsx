import { AnimatedHeadline } from './AnimatedHeadline';
import DotEffect from './DotEffect';
import { DotMatrix } from './DotMatrix';

export const OverviewSection = () => {
  return (
    <section className="bg-[#000000] h-screen relative sticky top-0">
      <div className="container mx-auto px-6 md:px-12 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            
          {/* Left Content */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/30" />
            <div className="pl-8">
              <h2 className="text-lg md:text-xl lg:text-xl font-bold text-white leading-tight mb-8">
                <AnimatedHeadline text="Break the link between" delay={0} />
                <br />
                <AnimatedHeadline text="sender and receiver" delay={200} />
              </h2>
              <p className="text-white/80 text-sm md:text-md max-w-lg leading-relaxed">
                Every blockchain transaction leaves a trail. Tesseract breaks that
                pattern — deposit once, pay anyone confidentially. Role-based encryption
                ensures no single party sees your complete transaction, and on-chain
                settlement guarantees every payment is accounted for.
              </p>
            </div>
          </div>
                        
          {/* Right Content - Circles with Dot Matrix */}
          <div className="relative flex justify-end items-center">
            {/* Main Circle */}
            <div className="w-full h-64 md:w-full md:h-80 lg:w-150 lg:h-180 flex items-center justify-center overflow-hidden">
              <video
                src="/feature2.mp4"
                loop
                muted
                autoPlay
                playsInline
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            
            
          </div>
        </div>
      </div>
    </section>
  );
};
export default OverviewSection;