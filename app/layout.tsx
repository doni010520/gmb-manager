import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GMB Manager - Gerencie seu Google Meu Negócio com IA",
  description: "Plataforma para escritórios de contabilidade gerenciarem o Google Meu Negócio com IA.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[oklch(0.13_0.02_165)]">
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[oklch(0.35_0.15_165)] opacity-20 blur-[120px] animate-float" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[oklch(0.3_0.15_200)] opacity-15 blur-[100px] animate-float delay-300" />
          <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-[oklch(0.3_0.1_130)] opacity-10 blur-[80px] animate-pulse-glow" />
        </div>
        {children}
      </body>
    </html>
  );
}
