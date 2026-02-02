import { TestimonialsColumn } from "@/app/components/ui/testimonials-columns";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getWaitlist, WaitlistServiceResponse } from "@/app/services/waitlistService";
import { createAvatar } from '@dicebear/core';
import { pixelArt } from '@dicebear/collection';

const Reviews = () => {
    const [reviews, setReviews] = useState<{ text: string; image: string; name: string; role: string; }[]>([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data: WaitlistServiceResponse[] = await getWaitlist();
                const mappedReviews = data.map((item) => {
                    const avatar = createAvatar(pixelArt, {
                        seed: item.name,
                    });
                    const svg = avatar.toString();
                    const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

                    return {
                        text: item.comment,
                        image: dataUrl,
                        name: item.name,
                        role: "Verified User" 
                    };
                });
                console.log("Fetched Reviews:", mappedReviews);
                setReviews(mappedReviews);
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
            }
        };

        fetchReviews();
    }, []);

    const firstColumn = reviews.slice(0, Math.ceil(reviews.length / 3));
    const secondColumn = reviews.slice(Math.ceil(reviews.length / 3), Math.ceil(reviews.length / 3) * 2);
    const thirdColumn = reviews.slice(Math.ceil(reviews.length / 3) * 2);

  return (

      <div className="flex flex-col items-center justify-center min-h-screen z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5 ">
            Users Reviews
          </h2>
          <p className="text-center mt-5 opacity-75 font-mono">
            See what our customers have to say about us.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden font-mono">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
  );
};

export default Reviews ;