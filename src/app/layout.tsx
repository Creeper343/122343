import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Fahrschulfinder Bergisches Land - Preise vergleichen & sparen",
    template: "%s | Fahrschulfinder",
  },
  description: "Vergleiche Fahrschulen in Solingen, Wuppertal & Umgebung. Finde die günstigste Fahrschule, berechne deine Führerschein-Kosten und spare bis zu 200€.",
  keywords: ["Fahrschule", "Solingen", "Wuppertal", "Führerschein Kosten", "Fahrschulvergleich", "Preise", "Bergisches Land"],
  authors: [{ name: "Fahrschulfinder Team" }],
  creator: "Fahrschulfinder",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://deine-domain.de", // <-- HIER DEINE DOMAIN ANPASSEN
    title: "Fahrschulfinder - Der transparente Vergleich",
    description: "Finde die beste Fahrschule in deiner Nähe. Kostenlos & transparent.",
    siteName: "Fahrschulfinder",
  },
  // Icons werden automatisch über die Dateikonvention (icon.png im app Ordner) geladen,
  // können aber auch hier explizit gesetzt werden, falls du favicon.ico nutzt.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Wichtig für SEO: Sprache auf Deutsch setzen
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}