import { AnimatedHeadline } from './AnimatedHeadline';


 const OverviewSection = () => {
  return (
    <section className="bg-[#000000] min-h-screen sticky top-0 flex items-center">
      <div className="container mx-auto px-6 md:px-12 py-12 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
          {/* Left Content */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/30 hidden md:block" />
            <div className="md:pl-8">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-6 md:mb-8">
                <AnimatedHeadline text="Break the link between" delay={0} />
                <br />
                <AnimatedHeadline text="intent and settlement" delay={200} />
              </h2>
              <div className="space-y-4">
                <p className="text-white/80 text-base md:text-lg max-w-lg leading-relaxed">
                  Every blockchain transaction leaves a trail.
                </p>
                <p className="text-white/80 text-base md:text-lg max-w-lg leading-relaxed">
                  We decouple <strong>business intent</strong> from <strong>public finality</strong>.
                  Using a split-knowledge architecture, Tesseract cryptographically isolates
                  your operational data from the ledger&apos;s permanent record. Execute high-velocity
                  payroll, vendor batches etc where your competitors see only math,
                  while your auditors retain full, decrypted visibility.
                </p>
              </div>
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