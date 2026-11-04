import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuizPortal — Free Live Quiz & Presentation Platform",
  description:
    "Create live quizzes and interactive presentations. Students join from any phone browser. See who's sure, who's guessing and who's stuck. Free forever.",
  keywords: [
    "quiz",
    "live quiz",
    "kahoot alternative",
    "mentimeter alternative",
    "interactive presentation",
    "classroom quiz",
    "AI quiz generator",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0a0f] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
