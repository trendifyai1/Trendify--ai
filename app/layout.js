import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Trendify AI",
  description: "Transforme vídeos longos em cortes virais com IA",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${syne.variable} ${dmSans.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#0B0B0B] text-white">{children}</body>
    </html>
  );
}
