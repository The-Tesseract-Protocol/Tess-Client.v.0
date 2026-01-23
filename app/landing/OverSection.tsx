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
                <AnimatedHeadline text="Tesseract redefines how" delay={0} />
                <br />
                <AnimatedHeadline text="the Internet uses data" delay={200} />
              </h2>
              <p className="text-white/80 text-sm md:text-md max-w-lg leading-relaxed">
                Data is the world's most valuable and also its most sensitive resource. 
                It powers all of our digital interactions, applications, and infrastructure. 
                Until now, its value was inherently fragile – in most cases, to use it, 
                its contents must be known.
              </p>
            </div>
          </div>
                        
          {/* Right Content - Circles with Dot Matrix */}
          <div className="relative flex justify-end items-center">
            {/* Main Circle */}
            <div className="w-64 h-64 md:w-80 md:h-80 lg:w-90 lg:h-140 flex items-center justify-center overflow-hidden">
             <DotEffect/>
            </div>
            
            {/* Secondary Circle - Partial */}
            <div className="absolute -right-32 md:-right-48 top-1/2 -translate-y-1/2 w-96 h-96 md:w-64 md:h-64 lg:w-110 lg:h-110 bg-[#FAF3E1] rounded-full bg-[#FAF3E1]/40" />
          </div>
        </div>
      </div>
    </section>
  );
};
export default OverviewSection;