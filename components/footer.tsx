import Link from "next/link"
import { Github, Twitter, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-dark-200 border-t border-dark-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-teal-400">Galatea.AI</h3>
            <p className="text-gray-400">
              Bringing the Pygmalion myth to life with cutting-edge artificial intelligence.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-teal-400">
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-teal-400">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-teal-400">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-200 mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-400">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-400">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-400">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-200 mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-teal-400">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-400">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-teal-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-200 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-teal-400">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-teal-400">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-300 mt-12 pt-8 text-center text-gray-400">
          <p>© 2024 Galatea.AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
