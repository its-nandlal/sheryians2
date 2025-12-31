import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/lib/providers/query-provider";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Sheryians Coding School",
  description: "Learn how to build modern websites with animations, explore awwwards-winning or award-winning websites, and courses on website creation. Master web technologies like Node.js, MongoDB, Socket.io, and databases such as DBMS. Dive into programming with Java, C, Python, and explore data analysis, blockchain, CPT, aptitude, HTML, CSS, and JavaScript for a comprehensive learning experience in modern web technologies.",
  keywords: ["modern web technologies", "animations", "award-winning websites", "Node.js", "MongoDB", "Socket.io", "DBMS", "Java", "C", "Python", "data analysis", "blockchain", "CPT", "aptitude", "HTML", "CSS", "JavaScript"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={``}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
