interface SectionCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function SectionCard({
  title,
  subtitle,
  children,
}: SectionCardProps) {
  return (
    <section className="rounded-xl border border-[#A4B1CC] bg-white p-6 shadow-lg">

     <div className="flex flex-col gap-0.5">
         <h2 className="text-lg font-bold text-[#1A216D]">
          {title}
         </h2>

         <span className="text-sm font-normal text-[#636669]">
          {subtitle}
        </span>
    </div>
         
      {children}
    </section>
  );
}