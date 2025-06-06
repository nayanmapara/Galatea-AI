import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Galatea.AI - Your Perfect AI Companion",
  description: "Create, customize, and connect with your ideal AI partner.",
  generator: "v0.dev",
  icons: {
    icon: "/favicon-white.png",
    shortcut: "/favicon-white.png",
    apple: "/favicon-white.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}