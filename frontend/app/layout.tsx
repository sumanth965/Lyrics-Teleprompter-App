import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Lyrics Teleprompter App",
  description: "A smooth, singer-friendly teleprompter for lyrics playback.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-black text-white">{children}</body>
    </html>
  );
}
