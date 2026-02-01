const investors = [
  { type: 'text', name: 'GLOBAL PAYROLL' },
  { type: 'text', name: 'NEOBANKS' },
  { type: 'name', name: 'NGO Relief Funds' },
  { type: 'text', name: 'GIG ECONOMY APPS' },
  { type: 'text', name: 'LOGISTICS CHAINS' },
  { type: 'name', name: 'Corporate Treasury' },
  { type: 'text', name: 'TRADE FINANCE' },
  { type: 'name', name: 'B2B Marketplaces' },
  { type: 'text', name: 'FINTECH AGGREGATORS' },
  { type: 'name', name: 'Human Capital Firms' },
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