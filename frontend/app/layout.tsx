import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "OBSIDIAN STAGE | Performance Lyrics Teleprompter",
  description:
    "The professional lyrics teleprompter designed for stage performance, tactile control, and seamless sync.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full bg-[#131313] text-[#e5e2e1]">{children}</body>
    </html>
  );
}
