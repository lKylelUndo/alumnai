import { Card, CardDescription, CardHeader } from "@/components/ui/card"
import Image from "next/image"

interface FeatureCardProps {
  title: string
  description: string
  icon: string
}

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <Card className="p-6">
      <CardHeader className="mb-4 flex justify-center">
        <Image src={icon} alt={title} width={50} height={50} />
      </CardHeader>
      <CardHeader className="text-center text-lg font-semibold text-slate-800">
        {title}
      </CardHeader>

      <CardDescription className="mt-3 text-center text-slate-600">
        {description}
      </CardDescription>
    </Card>
  )
}
