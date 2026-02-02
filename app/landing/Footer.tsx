import {lexendTera} from '@/app/components/Fonts';
const Footer = () => {
    return (
        <footer className="relative h-screen w-full overflow-hidden bg-black text-white">
            {/* 1. Background Video Layer */}
            <video
                src="/bg-collage-video.mp4"
                loop
                muted
                autoPlay
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
            />

            {/* Optional: Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/40" />

            {/* 2. Content Layer */}
            <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-8">

                {/* Main Center Content */}
                <div className="flex flex-col items-center gap-6 text-center">
                    <h1 className={`text-[12vw] md:text-[9rem] font-bold tracking-tighter ${lexendTera.className} leading-none select-none`}>
                        TESSERACT
                    </h1>
                    <p className="text-white/80 text-sm md:text-lg font-light tracking-wide max-w-4xl">
                        Functional Privacy For Institutions.
                    </p>
                    <p className="text-white/80 text-sm md:text-lg font-light tracking-wide max-w-4xl">
                        Compliant Confidential Auditable Payments on Stellar.
                    </p>
                </div>

                {/* Bottom Bar (Absolute within the relative container) */}
                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">

                    {/* Left - Built on Stellar */}
                    <div className="flex items-center gap-3 text-white/60 text-sm backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full border border-white/10">
                        <span>Built on</span>
                        <img
                            src="https://cryptologos.cc/logos/stellar-xlm-logo.svg?v=040"
                            alt="Stellar"
                            className="w-5 h-5 bg-white rounded-full p-1"
                        />
                        <span className="font-medium text-white">Stellar Soroban</span>
                    </div>

                    {/* Right - Social Links */}
                    <div className="flex items-center gap-6 backdrop-blur-sm bg-black/20 px-6 py-2 rounded-full border border-white/10">
                        <a
                            href="https://t.me/TheTesseractProtocol"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:scale-110 transition-transform duration-200 text-white/70 hover:text-white"
                            aria-label="Telegram"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.33-.373-.117l-6.869 4.332-2.96-.924c-.643-.204-.657-.643.136-.953l11.566-4.458c.542-.204 1.013.131.832.953z" />
                            </svg>
                        </a>
                        <a
                            href="https://github.com/The-Tesseract-Protocol"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:scale-110 transition-transform duration-200 text-white/70 hover:text-white"
                            aria-label="GitHub"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;