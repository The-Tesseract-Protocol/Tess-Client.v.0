import { Button } from "../components/ui/button";

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between py-8 px-16 fixed top-0 left-0 z-10 fixed top-0 w-full ">
      <div className="flex items-center gap-x-8 backdrop-blur-lg bg-black/40 rounded-3xl overflow-hidden  ">
        <a href="#" className="text-white/80 hover:text-white transition-colors mr-2">
        <img src="/Tess_BW.svg" alt="Tesseract Logo" className="h-8 w-8  mr-1 inline-block rounded-2xl" />
        TESSERACT
        </a>
      </div>
      <div className="backdrop-blur-md bg-black/40 rounded-3xl">
        <a href="https://abhinavs-organization-10.gitbook.io/the-tesseract-protocol/" className="px-4 py-2">
          <Button variant="outline" className="gap-2">
            Our Documentation
          </Button>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;