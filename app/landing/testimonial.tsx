'use client';
import { useState, useEffect } from 'react';
import { getWaitlist, WaitlistServiceResponse } from '@/app/services/waitlistService';
import ChromaGrid, { ChromaItem } from '../../components/ChromaGrid';
import DarkVeil from '../../components/DarkVeil';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const cardStyles = [
	{ borderColor: "#3B82F6", gradient: "linear-gradient(145deg, #3B82F6, #000)" },
	{ borderColor: "#10B981", gradient: "linear-gradient(180deg, #10B981, #000)" },
	{ borderColor: "#F59E0B", gradient: "linear-gradient(165deg, #F59E0B, #000)" },
	{ borderColor: "#EF4444", gradient: "linear-gradient(195deg, #EF4444, #000)" },
	{ borderColor: "#8B5CF6", gradient: "linear-gradient(225deg, #8B5CF6, #000)" },
	{ borderColor: "#06B6D4", gradient: "linear-gradient(135deg, #06B6D4, #000)" }
];

export function TestimonialsSection() {
	const [testimonials, setTestimonials] = useState<ChromaItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchTestimonials = async () => {
			try {
				const data: WaitlistServiceResponse[] = await getWaitlist();
				const mappedTestimonials: ChromaItem[] = data.map((item, index) => {
					const style = cardStyles[index % cardStyles.length];
					const avatar = createAvatar(lorelei, {
						seed: item.name,
					});
					const dataUrl = avatar.toDataUri();

					return {
						quote: item.comment,
						image: dataUrl,
						title: item.name,
						subtitle: item.institutionName,
						borderColor: style.borderColor,
						gradient: style.gradient,
						handle: `@${item.name.replace(/\s+/g, '').toLowerCase()}`
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

	if (isLoading) {
		return <div className="flex items-center justify-center min-h-screen">Loading testimonials...</div>;
	}

	return (
		<section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black py-20">
			<div className='absolute inset-0 w-full h-full pointer-events-none'>
				<DarkVeil
					hueShift={0}
					noiseIntensity={0}
					scanlineIntensity={0}
					speed={0.5}
					scanlineFrequency={0}
					warpAmount={0}
				/>
			</div>
			<div className='w-[70vw] text-center mb-10 z-10'>
				<h1 className="text-3xl md:text-5xl font-bold text-white z-10">What Our Users Say</h1>
			</div>
			<div className="z-10 relative w-[70vw]">
				<ChromaGrid
					items={testimonials}
				/>
			</div>
		</section>
	);
}
export default TestimonialsSection;


