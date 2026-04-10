import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PWARegister } from "@/components/pwa-register";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trail Planner",
  description: "Plan your next backpacking trip.",
  applicationName: "Trail Planner",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Trail Planner",
  },
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PWARegister />
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-md px-4 py-3">
            <p className="text-base font-semibold text-slate-900">Trail Planner</p>
          </div>
        </header>
        <div className="max-w-md mx-auto w-full px-4 py-6 space-y-6">{children}</div>
      </body>
    </html>
  );
}
