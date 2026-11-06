import type { Metadata } from "next";
import { Space_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./contexts/AppContext";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "../components/Navbar";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sun'iy Intelekt — O'zbek tilidagi AI o'rganish platformasi",
    template: "%s · Sun'iy Intelekt",
  },
  description:
    "Noldan LLM qurguncha. Python, Machine Learning, Transformer, Fine-tuning (LoRA), MLOps va AI Agent — interaktiv darslar, brauzerda Python kodi, XP va reyting. Hammasi o'zbek tilida, bepul.",
  keywords: [
    "AI", "sun'iy intellekt", "machine learning", "LLM", "deep learning",
    "PyTorch", "Transformer", "fine-tuning", "o'zbek tilida AI", "dasturlash o'rganish",
  ],
  authors: [{ name: "O'zbek AI Jamiyati" }],
  openGraph: {
    title: "AI Engineering — O'zbek tilidagi AI o'rganish platformasi",
    description:
      "Interaktiv darslar bilan noldan AI muhandis bo'ling. Python, LLM, Fine-tuning, MLOps — o'zbek tilida, bepul.",
    locale: "uz_UZ",
    type: "website",
    siteName: "AI_ENG.uz",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Engineering — O'zbek tilidagi AI o'rganish platformasi",
    description: "Noldan AI muhandis bo'ling. Interaktiv darslar, o'zbek tilida, bepul.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={`${spaceMono.variable} ${dmSans.variable}`}>
      <body>
        <AppProvider>
          <AuthProvider>
            <Navbar />
            {children}
            <footer>
              Yaratildi <span>♥</span> bilan · AI_ENG.uz · O'zbek AI Jamiyati · 2026
            </footer>
          </AuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}
