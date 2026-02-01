"use client";
import { motion } from "framer-motion";
import NeuralBackground from "@/app/components/ui/flow-bg";

export default function WishlistFormPage() {
  return (
    <div className="bg-black mt-8">
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{
            delay: 1.2,
            duration: 1.5,
            ease: "easeIn",
          }}
          viewport={{ once: true }}
        >
          <NeuralBackground 
            color="#818cf8"
            scale={1}
            trailOpacity={0.1}
            speed={0.8}
          />
        </motion.div>

      <section className="relative w-full overflow-hidden mt-7">
        <h1 className="mt-4 mb-8   py-8 relative z-10 bg-gradient-to-b from-white to-muted bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">Join Waitlist</h1>

        <div className=" py-20  z-10 flex items-center justify-center  -mt-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.6,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            className="w-full text-[1px] px-4 py-4 relative mt-3 max-w-lg backdrop-blur-md rounded-xl py-2 shadow-lg border border-white/5"
          >
            <form className="flex w-full flex-col gap-4 relative ">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none backdrop-blur-sm"
              />
              <input
                type="email"
                placeholder="Your Working Email"
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none backdrop-blur-sm"
              />
              <input
               type="text"
               placeholder ="Your Institution Name"
               className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none backdrop-blur-sm"
              />
              <textarea
                placeholder="Tell your business need...."
                rows={4}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none backdrop-blur-sm"
              />
              
              <textarea
                placeholder="Leave some comments..."
                rows={2}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none backdrop-blur-sm"
              />
              
                <div className="text-white/30 text-[9px] mb-3">
                  This comment might displayed on our page.
                </div>
          
              <button
                type="submit"
                className="w-full rounded-md bg-white/60 px-4 py-3 text-black font-medium hover:bg-white focus:outline-none transition-colors"
              >
                Join Waitlist
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
