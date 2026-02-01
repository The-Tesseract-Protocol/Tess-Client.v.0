'use client';
import { TestimonialsColumn } from "@/app/components/ui/testimonials-columns";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Reviews = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const wishlist = localStorage.getItem('wishlist');
        if (wishlist) {
            const wishlistItems = JSON.parse(wishlist);
            const newReviews = wishlistItems.map((item: { name: string; description: string; }) => ({
                text: item.description,
                image: `https://i.pravatar.cc/150?u=${item.name}`,
                name: item.name,
                role: "Wishlist Member"
            }));
            setReviews(prevReviews => [...prevReviews, ...newReviews]);
        }
    }, []);

    const firstColumn = reviews.slice(0, Math.ceil(reviews.length / 3));
    const secondColumn = reviews.slice(Math.ceil(reviews.length / 3), Math.ceil(reviews.length / 3) * 2);
    const thirdColumn = reviews.slice(Math.ceil(reviews.length / 3) * 2);

  return (
    <section className="bg-background my-20 relative">

      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5 ">
            User's Reviews
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
    </section>
  );
};

export default Reviews ;