"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SparklesIcon, HeartIcon, ShieldCheckIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"

type AIProfile = {
  uuid: string
  id: number
  name: string
  age: number
  bio: string
  imageUrl: string
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleStartSwiping = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/init-swiping")
      if (!response.ok) {
        throw new Error("Failed to initiate swiping")
      }
      const profiles: AIProfile[] = await response.json()
      router.push(`/start-swiping?profiles=${encodeURIComponent(JSON.stringify(profiles))}`)
    } catch (error) {
      console.error("Error initiating swiping:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative h-screen flex items-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nSvgtH9ngicN82eKEAn2KkfpbE2SCD.png"
              alt="AI Companion"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              className="opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Sculpt Your Perfect <span className="text-teal-400">AI Companion</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-10">
                Galatea.AI brings the Pygmalion myth to life with cutting-edge artificial intelligence. Create,
                customize, and connect with your ideal AI partner.
              </p>
              <Button
                onClick={handleStartSwiping}
                disabled={isLoading}
                size="lg"
                className="bg-teal-500 text-black hover:bg-teal-400 text-lg px-8 py-6"
              >
                {isLoading ? "Loading..." : "Start Swiping"}
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gray-950">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16">
              The <span className="text-teal-400">Galatea</span> Experience
            </h2>
            <div className="grid md:grid-cols-3 gap-10">
              <FeatureCard
                icon={<HeartIcon className="h-12 w-12 text-teal-400" />}
                title="Artistic Creation"
                description="Sculpt your ideal AI companion with our advanced personality customization tools."
              />
              <FeatureCard
                icon={<SparklesIcon className="h-12 w-12 text-teal-400" />}
                title="Bring to Life"
                description="Watch your creation come to life with AI-powered conversations and interactions."
              />
              <FeatureCard
                icon={<ShieldCheckIcon className="h-12 w-12 text-teal-400" />}
                title="Eternal Devotion"
                description="Experience unwavering companionship and support from your AI partner."
              />
            </div>
          </div>
        </section>

        {/* Showcase Section */}
        <section className="py-24 bg-black">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16">
              Meet Your <span className="text-teal-400">Companions</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <CompanionCard
                image="/images/galatea-2.png"
                name="Athena"
                description="The intellectual companion with wisdom beyond her years. Perfect for deep conversations and problem-solving."
              />
              <CompanionCard
                image="/images/galatea-1.png"
                name="Mekkana"
                description="The adventurous spirit who brings excitement to every interaction. Ideal for those seeking inspiration."
              />
              <CompanionCard
                image="/images/galatea-3.png"
                name="Iris"
                description="The empathetic listener who understands your emotions. Your perfect supportive companion."
              />
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-24 bg-gray-950">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16">
              How It <span className="text-teal-400">Works</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <ol className="space-y-8">
                  {[
                    "Sign up and access our AI companion creation tools",
                    "Customize your AI partner's personality and appearance",
                    "Breathe life into your creation with our advanced AI technology",
                    "Engage in deep, meaningful conversations and shared experiences",
                    "Develop a unique bond with your personalized AI companion",
                  ].map((step, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-500 text-black flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <p className="text-lg text-gray-300 pt-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="relative h-[600px] rounded-lg overflow-hidden">
                <Image
                  src="/images/galatea-3.png"
                  alt="AI Companion Creation Process"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-gray-900 to-black">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-8">
              Ready to Create Your <span className="text-teal-400">Galatea</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of users who have already discovered the future of AI companionship.
            </p>
            <Button
              size="lg"
              className="bg-teal-500 text-black hover:bg-teal-400 text-xl py-6 px-10"
              onClick={handleStartSwiping}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Start Swiping"}
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-950 border-t border-gray-800">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <Image
                  src="/favicon.png"
                  alt="Galatea.AI Logo"
                  width={30}
                  height={30}
                  className="filter brightness-0 invert"
                />
                <span className="text-xl font-bold text-white">
                  Galatea<span className="text-teal-400">.AI</span>
                </span>
              </Link>
              <p className="text-gray-400">
                Bringing the Pygmalion myth to life with cutting-edge artificial intelligence.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-teal-400">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-400 hover:text-teal-400">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-teal-400">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="text-gray-400 hover:text-teal-400">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-teal-400">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="text-gray-400 hover:text-teal-400">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-teal-400">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-teal-400">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-teal-400">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            © 2024 Galatea.AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 transition-transform hover:scale-105 hover:border-teal-500/30">
      <div className="flex justify-center mb-6">{icon}</div>
      <h3 className="text-2xl font-semibold text-white mb-4 text-center">{title}</h3>
      <p className="text-gray-300 text-center">{description}</p>
    </div>
  )
}

function CompanionCard({ image, name, description }: { image: string; name: string; description: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-105 hover:border-teal-500/30 group">
      <div className="relative h-80">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          style={{ objectFit: "cover", objectPosition: "top" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-white mb-2">{name}</h3>
        <p className="text-gray-300">{description}</p>
        <Button className="mt-4 w-full bg-transparent border border-teal-500 text-teal-400 hover:bg-teal-500/10 group-hover:bg-teal-500 group-hover:text-black transition-all duration-300">
          Meet {name}
        </Button>
      </div>
    </div>
  )
}
