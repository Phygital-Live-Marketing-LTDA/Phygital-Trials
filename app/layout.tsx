import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { OnlineStatusProvider } from "./store/statusContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Phygital",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <OnlineStatusProvider>
        <body className={inter.className}>{children}</body>
      </OnlineStatusProvider>
    </html>
  );
}
