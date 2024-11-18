import type { Metadata } from "next";

import "./globals.css";
import { Figtree, Rubik } from "next/font/google";
import { ReactNode } from "react";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Store Files",
  description: "Store Files - The only storage your solution needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} font-figtree  antialiased`}>
        {children}
      </body>
    </html>
  );
}
