import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "NepoWatch - Nepal's Digital Resistance Hub",
  description: "Community platform tracking Nepal's social media ban and Gen Z protests. Featuring curated TikTok content and the Nepo Kids corruption database.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background">
        <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-2xl">🏴‍☠️</div>
                <h1 className="text-xl font-bold">NepoWatch</h1>
              </div>
              <nav className="hidden md:flex space-x-6">
                <Link href="/" className="text-foreground/70 hover:text-foreground transition-colors">
                  Feed
                </Link>
                <Link href="/videos" className="text-foreground/70 hover:text-foreground transition-colors">
                  Videos
                </Link>
                <Link href="/submit" className="text-foreground/70 hover:text-foreground transition-colors">
                  Submit
                </Link>
                <Link href="/nepo-kids" className="text-foreground/70 hover:text-foreground transition-colors">
                  Nepo Kids
                </Link>
                <Link href="/admin" className="text-foreground/70 hover:text-foreground transition-colors">
                  Admin
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}