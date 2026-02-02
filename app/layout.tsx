import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/lib/providers/query-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Sheryians Coding School",
  description:
    "Learn how to build modern websites with animations, explore awwwards-winning or award-winning websites, and courses on website creation. Master web technologies like Node.js, MongoDB, Socket.io, and databases such as DBMS. Dive into programming with Java, C, Python, and explore data analysis, blockchain, CPT, aptitude, HTML, CSS, and JavaScript for a comprehensive learning experience in modern web technologies.",
  keywords: [
    "modern web technologies",
    "animations",
    "award-winning websites",
    "Node.js",
    "MongoDB",
    "Socket.io",
    "DBMS",
    "Java",
    "C",
    "Python",
    "data analysis",
    "blockchain",
    "CPT",
    "aptitude",
    "HTML",
    "CSS",
    "JavaScript",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body className={``}>
        <QueryProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background:
                  "linear-gradient(to top right, #003023ad, #007655b1)",
                border: "1px solid #006f55a5",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: "9999px",
                width: "fit-contemt",
              },
              className:
                "mt-4 w-fit! px-6! py-2.5! !text-emerald-400 left-1/2! -translate-x-1/2! text-nowrap! shadow-inner! shadow-[#009774]/60!",
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
