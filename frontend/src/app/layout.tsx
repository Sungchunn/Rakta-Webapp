import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rakta - Blood Donation Habit",
  description: "Build a consistent, healthy, and proud blood donation habit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="container" style={{ marginTop: "20px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
