import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./storeProvider";
import Navbar from "@/components/header/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Unisocial",
  description: "created by Uni Pvt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body className={inter.className}>
        <div className="absolute top-0 h-screen w-screen flex justify-center items-center lg:hidden">
          Mobile view is not avialable
        </div>
        <div className="hidden  w-full lg:flex justify-center min-h-screen bg-gray-950 text-gray-300">
          <Provider>
            <div className=" w-full  px-3">
              <div
                className="w-full h-14 flex justify-center
             z-50"
              >
                <Navbar />
              </div>
              <div className="">{children}</div>
            </div>
          </Provider>
        </div>
      </body>
    </html>
  );
}
