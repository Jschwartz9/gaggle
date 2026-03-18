import type { Metadata } from "next";
import { Inter, Playfair_Display, Spectral } from 'next/font/google';
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import { MotionProvider } from "@/components/MotionProvider";

// Configure Google Fonts
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair-display',
});

const spectral = Spectral({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-spectral',
});

export const metadata: Metadata = {
  title: "Gaggle",
  description: "Social event discovery for young professionals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfairDisplay.variable} ${spectral.variable} font-body antialiased`}
        suppressHydrationWarning={true}
      >
        <AppProvider>
          <MotionProvider>
            {children}
          </MotionProvider>
        </AppProvider>
      </body>
    </html>
  );
}
