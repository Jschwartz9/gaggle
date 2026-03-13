import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
