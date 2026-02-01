"use client";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "@/app/components/ui/lamp";
import NeuralBackground from "@/app/components/ui/flow-bg";

export default function WishlistFormPage() {
  return (
    <div className="bg-slate-950 mt-8">
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{
            delay: 3,
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
      {/* Section 1: Lamp Container */}

      {/* Section 2: Form Section */}
      <section className= "relative min-h-screen w-full overflow-hidden">
        {/* Neural Background - fills entire section, fades in after 3s */}
          <h1 className=" relative z-50 mb-3 bg-gradient-to-b from-white to-muted bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">Join Waitlist</h1>


        {/* Form - centered on top of background */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.6,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            className="w-full max-w-lg  backdrop-blur-md rounded-xl p-8 shadow-lg border border-white/5"
          >
            <form className="flex w-full flex-col gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none backdrop-blur-sm"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none backdrop-blur-sm"
              />
              <textarea
                placeholder="what's your business need?"
                rows={4}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none backdrop-blur-sm"
              />
              <textarea
                placeholder="Leave some comments..."
                rows={2}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none backdrop-blur-sm"
              />
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
