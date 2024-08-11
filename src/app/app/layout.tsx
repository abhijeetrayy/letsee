import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import localfont from "next/font/local";
import "../globals.css";
import UserPrefrenceProvider from "@/app/contextAPI/userPrefrenceProvider";
import Footbar from "@/components/footbar/foot";
import Navbar from "@/components/header/navbar";
import { ToastContainer } from "react-toastify";

// const inter = Inter({ subsets: ["latin"] });

const inter = localfont({
  src: [{ path: "../../../public/font/Inter.ttf", weight: "400" }],
  variable: "--font-inter",
});

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
      <body className={inter.variable}>
        <div className="absolute top-0 min-h-screen w-screen flex justify-center items-center lg:hidden">
          Mobile view is not avialable
        </div>
        <div className="hidden  w-full font-inter lg:flex justify-center  bg-neutral-900 text-gray-300">
          <UserPrefrenceProvider>
            <div className=" w-full">
              <div
                className="w-full h-14 flex justify-center
             z-50"
              >
                <Navbar />
              </div>
              <div className="min-h-screen">{children}</div>
              <Footbar />
            </div>
            <ToastContainer />
          </UserPrefrenceProvider>
        </div>
      </body>
    </html>
  );
}
