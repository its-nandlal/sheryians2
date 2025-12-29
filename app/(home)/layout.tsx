

import Header from "@/components/(default hf)/header/header";
import "../globals.css";

export default function HomeLayout({children,}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <div className=" w-full h-screen  bg-linear-to-tr from-black to-[#0a372a] text-white">
    <Header />
    {children}
  </div>
  ) ;
}
