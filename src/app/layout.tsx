import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TelemetryProvider } from "@/context/TelemetryContext";
import { NavigationSidebar } from "@/components/NavigationSidebar";
import { TopHeader } from "@/components/TopHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NEUROPIT | Mission Control",
  description: "AEROS-XAI Mission Control",
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
      <body className="min-h-screen h-screen flex bg-[#000] text-white font-sans overflow-hidden">
        <TelemetryProvider>
          <NavigationSidebar />
          <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 bg-[#000]">
            <TopHeader />
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#000]">
              {children}
            </div>
          </div>
        </TelemetryProvider>
      </body>
    </html>
  );
}
