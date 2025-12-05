import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MobileLayout from "@/components/MobileLayout";

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
        <MobileLayout>
          {children}
        </MobileLayout>
      </body>
    </html>
  );
}
