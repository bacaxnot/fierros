import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fierros",
  description: "AI-powered workout tracking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
