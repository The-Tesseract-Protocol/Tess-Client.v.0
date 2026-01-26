const Footer = () => {
    return (
        <div className="bg-black text-white text-[9rem] p-8 min-h-screen flex flex-col items-center justify-center relative">
            <div className="flex flex-col items-center gap-8">
                <h1>TESSERACT</h1>
            </div>
            <a 
                href="https://t.me/TheTesseractProtocol" 
                target="_blank" 
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 hover:opacity-80 transition-opacity"
            >
                <svg 
                    width="64" 
                    height="64" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.33-.373-.117l-6.869 4.332-2.96-.924c-.643-.204-.657-.643.136-.953l11.566-4.458c.542-.204 1.013.131.832.953z"/>
                </svg>
            </a>
        </div>
    )
}

export default Footer;
