import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "YouTube Comment Insights | AI Analysis",
  description: "Analyze YouTube comments with Gemini AI for sentiment and trends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${outfit.variable} ${jetbrainsMono.variable} antialiased`}>
      <body className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
