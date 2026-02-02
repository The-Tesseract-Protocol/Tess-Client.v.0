'use client'
import { useState } from 'react';
import { Button } from "../components/ui/button";
import { WishlistModal } from '../components/ui/WishlistModal';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useRouter();

    const handleJoinWaitlistClick = () => {
       navigate.push('/landing/WishlistForm');
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    const handleFormSubmit = (data: { name: string; email: string; description: string }) => {
        const existingWishlist = localStorage.getItem('wishlist');
        const wishlist = existingWishlist ? JSON.parse(existingWishlist) : [];
        wishlist.push(data);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        handleCloseModal();
    }

  return (
    <>
    <nav className="w-full flex items-center justify-between py-8 px-16 fixed top-0 left-0 z-50 fixed top-0 w-full ">
      <div className="flex items-center gap-x-8 backdrop-blur-lg bg-black/40 rounded-3xl overflow-hidden  ">
        <Link href="#" className="text-white/80 hover:text-white transition-colors mr-2 flex items-center">
        <Image src="/Tess-W.png" alt="Tesseract Logo" width={32} height={32} className="h-8 w-8  mr-1 inline-block rounded-2xl" />
        TESSERACT
        </Link>
      </div>
      <div className="flex items-center gap-4 backdrop-blur-md bg-black/40 rounded-3xl px-2 py-1">
        <a href="https://tessfi.gitbook.io/docs-tess/" className="px-2">
          <Button variant="default" className="gap-2 text-white/70 hover:text-white">
            Docs
          </Button>
        </a>
        <Button variant="outline" className="gap-2" onClick={handleJoinWaitlistClick}>
            Join Waitlist
          </Button>
      </div>
    </nav>
    <WishlistModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
    />
    </>
  );
};

export default Navbar;