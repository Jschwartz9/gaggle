import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import { MotionProvider } from "@/components/MotionProvider";

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
      <body className="font-sans antialiased" suppressHydrationWarning={true}>
        <AppProvider>
          <MotionProvider>
            {children}
          </MotionProvider>
        </AppProvider>
      </body>
    </html>
  );
}
