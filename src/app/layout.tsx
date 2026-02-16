import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Home Upkeep AI",
  description: "AI-powered home maintenance dashboard for rental property owners",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
