import type { Metadata } from "next";
import "./globals.css";
import { createServerClient } from "@/utils/supabase/server";
import SetUsernameModal from "@/components/auth/SetUsernameModal";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let needsUsername = false;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single();
    if (!profile || !profile.username) {
      needsUsername = true;
    }
  }

  return (
    <html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
      <head>
        {/* Gallery Typography */}
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-50">
        <div className="flex-1 flex flex-col relative z-0">
          {needsUsername && <SetUsernameModal />}
          {children}
        </div>
        <footer className="w-full border-t border-slate-800 bg-slate-950 mt-auto relative z-10">
          <div className="max-w-[1440px] mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Transmorpher Hub. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="https://github.com/Kirazul/Transmorpher" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-400 hover:text-frost-blue transition-colors">
                Transmorpher Addon
              </a>
              <a href="https://github.com/seolyam/transmorpher-hub" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-400 hover:text-frost-blue transition-colors">
                Transmorpher Hub Repo
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
