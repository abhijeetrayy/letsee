import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import UserPrefrenceProvider from "@/app/contextAPI/userPrefrenceProvider";
import Footbar from "@/components/footbar/foot";
import Navbar from "@/components/header/navbar";
import SetupComp from "@/components/setupComponents/SetupComp";
import { createClient } from "@/utils/supabase/server";
import localfont from "next/font/local";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { SearchProvider } from "../contextAPI/searchContext";
import "../globals.css";

// const inter = Inter({ subsets: ["latin"] });

const inter = localfont({
  src: [{ path: "../../../public/font/Inter.ttf", weight: "400" }],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "let's see - Unisocial",
  description: "Cinema Social Media",
};

async function getUsername() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  const { data: profileData }: any = await supabase
    .from("users")
    .select("*")
    .eq("id", userData.user?.id)
    .single();

  return { profileData };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { profileData } = await getUsername();

  if (profileData.username == null) {
    return <SetupComp />;
  } else {
    return (
      <html lang="en" className="">
        <body className={inter.variable}>
          <div className=" w-full font-inter flex justify-center  bg-neutral-900 text-gray-300">
            <UserPrefrenceProvider>
              <SearchProvider>
                <div className=" w-full">
                  <div
                    className="w-full h-14 flex justify-center
                  z-50"
                  >
                    <Navbar />
                  </div>
                  <div className="min-h-screen px-3">{children}</div>
                  <Footbar />
                </div>
                <ToastContainer />
              </SearchProvider>
            </UserPrefrenceProvider>
          </div>
        </body>
      </html>
    );
  }
}
