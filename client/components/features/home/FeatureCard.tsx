import { Card, CardDescription, CardHeader } from "@/components/ui/card"
import Image from "next/image"

interface FeatureCardProps {
  title: string
  description: string
  icon: string
}

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <Card className="p-6 border border-[#A4B1CC] hover:translate-y-0.5 transition-transform duration-300">
      <CardHeader className="mb-2 flex justify-center">
        <Image src={icon} alt={title} width={50} height={50} loading="eager" />
      </CardHeader>
      <CardHeader className="text-center text-lg font-semibold text-slate-800">
        {title}
      </CardHeader>

      <CardDescription className="text-center text-slate-600">
        {description}
      </CardDescription>
    </Card>
  )
}
