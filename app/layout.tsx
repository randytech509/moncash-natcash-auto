import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MonCash & NatCash Auto — RandyTech Solutions",
  description: "Auto-vérification des dépôts MonCash/NatCash par lecture de SMS, par RandyTech Solutions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
