import { preconnect } from 'react-dom';
import { ClerkProvider } from '@clerk/nextjs';
import { shadcn } from '@clerk/themes';
import type { Metadata, Viewport } from 'next';
import { DM_Sans, Instrument_Sans } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { UnitProvider } from '@/components/unit-toggle';
import './globals.css';

const dmSans = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
});

const instrumentSans = Instrument_Sans({
  variable: '--font-heading',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Petrichor - US Weather',
    template: '%s | Petrichor',
  },
  description:
    'Weather conditions and forecasts for US locations, powered by weather.gov',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f0ea' },
    { media: '(prefers-color-scheme: dark)', color: '#2d2419' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  preconnect('https://api.weather.gov');

  return (
    <ClerkProvider
      appearance={{
        theme: shadcn,
        cssLayerName: 'clerk',
        elements: {
          userButtonAvatarBox: '[&_img]:sepia',
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${dmSans.variable} ${instrumentSans.variable} min-h-screen bg-background font-sans antialiased`}
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:shadow-lg"
          >
            Skip to content
          </a>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <UnitProvider>
              <main id="main-content">{children}</main>
            </UnitProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
