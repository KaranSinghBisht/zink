import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Hanken_Grotesk,
  IBM_Plex_Mono,
} from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  weight: ["400", "500", "600", "700", "800"],
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Zink — payment links that never link back",
  description:
    "Non-custodial Zcash payment links. Every link is a fresh shielded address — customers pay, and learn nothing else about you.",
  openGraph: {
    title: "Zink — payment links that never link back",
    description:
      "Non-custodial Zcash payment links. Every link is a fresh Orchard-only shielded address, reconciled through a viewing key.",
    siteName: "Zink",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Zink — payment links that never link back",
    description:
      "Non-custodial Zcash payment links on mainnet. Fresh shielded address per invoice.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${hanken.variable} ${bricolage.variable} ${mono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
