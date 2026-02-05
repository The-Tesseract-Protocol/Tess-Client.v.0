"use client";

import { ShieldCheck, Zap, Fingerprint, Layers, Scale} from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";
import { Plasma } from '../../components/Plasma';

export default function Features() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-12 md:py-24 bg-transparent">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Plasma
          color="#B09FEA"
          speed={0.2}
          direction="forward"
          scale={1.1}
          opacity={0.9}
          mouseInteractive={false}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 md:px-16 max-w-7xl bg-transparent">
        <div className="text-center mb-12 md:mb-20 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold font-mono tracking-tighter text-white drop-shadow-2xl">
            Core Features
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto text-sm md:text-base font-semibold">
            Built on privacy-first principles to ensure your financial autonomy and data security.
          </p>
        </div>

        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
          <GridItem
            area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
            icon={<Layers className="h-4 w-4 text-white" />}
            title="Stealth Settlement Rail"
            description="On-chain finality with off-chain privacy. We decouple business intent from settlement via Soroban-native smart contracts."
          />
          <GridItem
            area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
            icon={<Zap className="h-4 w-4 text-white" />}
            title="High-Velocity Batching"
            description="Re-engineered SDP core supporting atomic batching to improve throughput for enterprise-grade performance."
          />
          <GridItem
            area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
            icon={<Fingerprint className="h-4 w-4 text-white" />}
            title="Zero-Knowledge Audit Suite"
            description="Satisfy AML/KYC mandates without leaking PII. Local browser-side decryption ensures auditors see everything while the network sees nothing."
          />
          <GridItem
            area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
            icon={<ShieldCheck className="h-4 w-4 text-white" />}
            title="Bank-Grade Security"
            description="Integrated with DFNS and Privy to provide HSM-backed custody and seamless institutional authentication."
          />
          <GridItem
            area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
            icon={<Scale className="h-4 w-4 text-white" />}
            title="Regulatory Survival"
            description="Engineered for a post-privacy-coin world. Compliant selective disclosure that meets global regulatory standards in the EU, India, and beyond."
          />
        </ul>
      </div>
    </section>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-white/10 p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] border-white/10 bg-zinc-900/40 backdrop-blur-md p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-white/10 bg-white/5 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-white">
                {title}
              </h3>
              <h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-white/60">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
