import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Head from 'next/head'
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Galatea.AI - Your Perfect AI Companion",
  description: "Create, customize, and connect with your ideal AI partner.",
  generator: 'v0.dev',
  icons: {
    icon: '/favicon-white.png',
    shortcut: '/favicon-white.png',
    apple: '/favicon-white.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Head>
          {/* Favicon link */}
          <link rel="icon" href="/favicon-white.png" />
          {/* You can also add other favicon links or meta tags here */}
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}