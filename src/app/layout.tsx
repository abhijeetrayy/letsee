import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@components/header/navbar";
import { SearchProvider } from "./contextAPI/searchContext";
import AuthProvider from "./contextAPI/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Let's see",
  description: "A social media platform for movie lovers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <SearchProvider>
            <header className="sticky top-0 w-full m-auto z-50 bg-neutral-900">
              <Navbar />
            </header>
            {children}
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
