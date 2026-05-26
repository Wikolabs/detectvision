import type { Metadata } from "next";
import { Saira, Fira_Sans } from "next/font/google";
import "./globals.css";

const fontDisplay = Saira({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
});

const fontBody = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "DetectVision — Votre caméra voit. Notre IA comprend.",
  description:
    "Détection d'objets, classification d'images et analyse visuelle en temps réel pour industrie et retail.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`${fontDisplay.variable} ${fontBody.variable}`}
        style={{ background: "#eff6ff", fontFamily: "var(--font-body)" }}
      >
        {children}
      </body>
    </html>
  );
}
