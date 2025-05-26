import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="bg-dark-200/50 border border-dark-300 hover:border-teal-500/30 transition-all duration-300 hover:translate-y-[-5px]">
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-6 text-teal-400">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-100 mb-3">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </CardContent>
    </Card>
  )
}
