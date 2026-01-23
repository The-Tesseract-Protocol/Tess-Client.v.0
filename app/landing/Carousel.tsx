const investors = [
  { type: 'text', name: 'LONGHASH VENTURES' },
  { type: 'text', name: 'JUMP' },
  { type: 'name', name: 'Anatoly Yakovenko' },
  { type: 'text', name: 'COINBASE VENTURES' },
  { type: 'text', name: 'GREENFIELD' },
  { type: 'name', name: 'Balaji Srinivasan' },
  { type: 'text', name: 'NGC VENTURES' },
  { type: 'name', name: 'Keone Hon' },
  { type: 'text', name: 'L2IV' },
  { type: 'name', name: 'Mert Mumtaz' },
];

export const InvestorCarousel = () => {
  const allItems = [...investors, ...investors];

  return (
    <section className="bg-[#000000] py-6 relative">
      <div className="animate-carousel flex items-center whitespace-nowrap">
        {allItems.map((investor, index) => (
          <div
            key={index}
            className="relative flex items-center justify-center px-5 md:px-5"
          >
            {/* Vertical Divider */}
            <div className="h-20 absolute top-0 left-0 inset-y-0 w-px bg-white/20" />

            {/* Content */}
            {investor.type === 'name' ? (
              <span className="text-[#FAF3E1]/90 text-sm tracking-wider">
                {investor.name}
              </span>
            ) : (
              <span className="text-[#FAF3E1] font-bold text-sm md:text-base tracking-widest">
                {investor.name}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Horizontal Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20" />
    </section>
  );
};

export default InvestorCarousel;