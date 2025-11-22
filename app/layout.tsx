import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "E-commerce: Guide Pratique 2025 | Ebook",
  description: "Ebook de ~40 pages sur le e-commerce, de l'id?e ? la croissance rentable.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
