import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Transmorpher Hub — WotLK Transmog Community",
  description:
    "Browse, share, and import community loadouts for the Transmorpher addon. " +
    "World of Warcraft: Wrath of the Lich King (Patch 3.3.5a).",
  keywords: [
    "WoW",
    "WotLK",
    "Transmorpher",
    "Transmog",
    "3.3.5a",
    "Loadouts",
    "Addon",
    "World of Warcraft",
  ],
  openGraph: {
    title: "Transmorpher Hub",
    description:
      "The community gallery for Transmorpher addon loadouts — WotLK 3.3.5a.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
      <head>
        {/* Gallery Typography */}
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
