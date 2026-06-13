import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OBSIDIAN STAGE | Performance Lyrics Teleprompter",
  description: "Performance lyrics teleprompter landing page and stage-ready player experience.",
};

import { AuthProvider } from "../contexts/AuthContext";
import { SongsProvider } from "../contexts/SongsContext";
import { SettingsProvider } from "../contexts/SettingsContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-full bg-[#131313] text-[#e5e2e1]">
        <AuthProvider>
          <SettingsProvider>
            <SongsProvider>{children}</SongsProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
