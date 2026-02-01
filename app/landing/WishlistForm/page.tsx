"use client";
import { motion } from "framer-motion";
import NeuralBackground from "@/app/components/ui/flow-bg";
import { useState, FormEvent } from "react";

export default function WishlistFormPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    institutionName: "",
    websiteURL: "",
    description: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/waitlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message || "Successfully added to waitlist!" });
        setFormData({
          name: "",
          email: "",
          institutionName: "",
          websiteURL: "",
          description: "",
          comment: "",
        });
      } else {
        setMessage({ type: "error", text: data.message || "Failed to join waitlist. Please try again." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please check your connection." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-black w-screen h-screen">
      <div className="fixed top-0 left-0 w-full z-[100] bg-indigo-600 text-white py-2 text-center text-sm font-medium">
        <span>We have a testnet sandbox ready for you to explore! </span>
        <a href="/dashboard" className="underline hover:text-indigo-200 ml-1">
          Try the Dashboard
        </a>
      </div>
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

      <section className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden mt-7">
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
            className="w-full px-4 py-4 relative mt-3 max-w-lg backdrop-blur-md rounded-xl py-2 shadow-lg border border-white/5"
          >
            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 relative ">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none backdrop-blur-sm"
              />
              <input
                type="email"
                name="email"
                placeholder="Working Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none backdrop-blur-sm"
              />
              <input
               type="text"
               name="institutionName"
               placeholder ="Your Institution Name"
               value={formData.institutionName}
               onChange={handleChange}
               required
               className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none backdrop-blur-sm"
              />
              <input
               type="text"
               name="websiteURL"
               placeholder ="Your Institution Website URL"
               value={formData.websiteURL}
               onChange={handleChange}
               required
               className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none backdrop-blur-sm"
              />
              <textarea
                name="description"
                placeholder="Tell your business need...."
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none backdrop-blur-sm"
              />

              <textarea
                name="comment"
                placeholder="Leave some comments..."
                rows={2}
                value={formData.comment}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none backdrop-blur-sm"
              />

                <div className="text-white/30 text-xs">
                  <span className="rounded-full text-[8px]  text-white px-2 py-1.5 mr-1">*</span>Tell us what you liked about us , this comment       might displayed on our page
                </div>

              {message && (
                <div className={`text-sm p-3 rounded-xl ${
                  message.type === "success"
                    ? "bg-green-500/10 border border-green-500/20 text-green-400"
                    : "bg-red-500/10 border border-red-500/20 text-red-400"
                }`}>
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-white/60 px-4 py-3 text-black font-medium hover:bg-white focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Joining..." : "Join Waitlist"}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
