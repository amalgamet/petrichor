import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { UnitProvider } from "@/components/unit-toggle";
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
  title: {
    default: "Petrichor \u2014 US Weather",
    template: "%s | Petrichor",
  },
  description: "Weather conditions and forecasts for US locations, powered by weather.gov",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <UnitProvider>{children}</UnitProvider>
      </body>
    </html>
  );
}
