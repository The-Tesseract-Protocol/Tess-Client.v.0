"use client";

import { useState } from "react";
import { Button } from "./button";

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; description: string }) => void;
}

export const WishlistModal = ({ isOpen, onClose, onSubmit }: WishlistModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, description });
    setName("");
    setEmail("");
    setDescription("");
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-black/10 z-50 flex justify-center items-center">
      <div className="bg-gradient-to-br from-white/30 via-white/15 to-black rounded-2xl border border-gray-900 shadow-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-4  font-mono">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white font-space">Join the Wishlist</h2>
          <button onClick={onClose} className="text-white">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-white mb-1 font-mono">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-black/30 text-white border rounded-xl border-gray-800 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-white mb-1 font-mono">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-black/30 text-white  rounded-xl border border-gray-800 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-white mb-1 font-mono">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded bg-black/30 text-white rounded-xl border border-gray-800 focus:outline-none focus:border-blue-500"
              rows={4}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="outline">Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
