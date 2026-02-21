import type { Metadata } from 'next';
import { Lora, Playfair_Display } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { UnitProvider } from '@/components/unit-toggle';
import './globals.css';

const lora = Lora({
  variable: '--font-serif',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-display-serif',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Petrichor \u2014 US Weather',
    template: '%s | Petrichor',
  },
  description:
    'Weather conditions and forecasts for US locations, powered by weather.gov',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${lora.variable} ${playfair.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <UnitProvider>{children}</UnitProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
