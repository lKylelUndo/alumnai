import Image from "next/image";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

export default function FeatureCard({
  title,
  description,
  icon,
}: FeatureCardProps) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">
      <div className="flex justify-center mb-4">
        <Image
          src={icon}
          alt={title}
          width={50}
          height={50}
        />
      </div>

      <h3 className="text-center font-semibold text-lg text-slate-800">
        {title}
      </h3>

      <p className="text-center text-slate-600 mt-3">
        {description}
      </p>
    </div>
  );
}