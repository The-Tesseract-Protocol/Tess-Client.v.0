'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GridPattern } from '@/app/components/ui/grid-pattern';
import { getWaitlist, WaitlistServiceResponse } from '@/app/services/waitlistService';
import { createAvatar } from '@dicebear/core';
import { pixelArt } from '@dicebear/collection';

type Testimonial = {
	name: string;
	image: string;
	institutionName: string;
	quote: string;
};

export function TestimonialsSection() {
	const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchTestimonials = async () => {
			try {
				const data: WaitlistServiceResponse[] = await getWaitlist();
				const mappedTestimonials = data.map((item) => {
					const avatar = createAvatar(pixelArt, {
						seed: item.name,
					});
					const svg = avatar.toString();
					const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

					return {
						quote: item.comment,
						image: dataUrl,
						name: item.name,
						institutionName: item.institutionName,
					};
				});
				setTestimonials(mappedTestimonials);
			} catch (error) {
				console.error('Failed to fetch testimonials:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTestimonials();
	}, []);

	return (
		<section className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden">
			<div aria-hidden className="absolute inset-0 isolate z-0 overflow-hidden">
				<div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(255,255,255,0.06)_0%,rgba(140,140,140,0.02)_50%,rgba(255,255,255,0.01)_80%)] absolute top-0 left-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full" />
				<div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 translate-x-[5%] -translate-y-1/2 -rotate-45 rounded-full" />
				<div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 -translate-y-87.5 -rotate-45 rounded-full" />
			</div>
			<div className="mx-auto max-w-5xl space-y-8">
				<div className="flex flex-col gap-2">
					<h1 className="text-center text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 text-xl font-bold tracking-wide text-balance font-mono md:text-3xl lg:text-4xl xl:text-5xl xl:font-bold">
						Our User's Reviews
					</h1>
				</div>

				{isLoading ? (
					<div className="flex justify-center py-20">
						<div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
					</div>
				) : testimonials.length === 0 ? (
					<div className="text-center py-20 text-white/50">
						No testimonials yet. Be the first to share your experience!
					</div>
				) : (
					<div className="relative grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols- mt-4">
						{testimonials.map(({ name, institutionName, quote, image }, index) => (
							<motion.div
								initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
								whileInView={{
									filter: 'blur(0px)',
									translateY: 0,
									opacity: 1,
								}}
								viewport={{ once: true }}
								transition={{ delay: 0.1 * Math.min(index, 5) + 0.1, duration: 0.8 }}
								key={index}
								className="border-white/20 relative grid grid-cols-[auto_1fr] gap-x-3 overflow-hidden border border-dashed p-4 bg-white/[0.02] py-8 mx-2 rounded-2x"
							>
								<div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(to_bottom,white,transparent)]">
									<div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]">
										<GridPattern
											width={25}
											height={25}
											x={-12}
											y={4}
											strokeDasharray="3"
											className="stroke-white/20 fill-white/5 absolute inset-0 h-full w-full mix-blend-overlay"
										/>
									</div>
								</div>
								<img
									alt={name}
									src={image}
									loading="lazy"
									className="size-9 rounded-full"
								/>
								<div>
									<div className="-mt-0.5 -space-y-0.5">
										<p className="text-sm md:text-base text-white">{name}</p>
										<span className="text-white/50 block text-[11px] font-light tracking-tight">
											{institutionName}
										</span>
									</div>
									<blockquote className="mt-3">
										<p className="text-white/80 text-sm font-light tracking-wide font-mono">
											{quote}
										</p>
									</blockquote>
								</div>
							</motion.div>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
export default TestimonialsSection;

