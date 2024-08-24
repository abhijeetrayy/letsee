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
          <div className="w-full font-inter flex flex-col justify-center bg-neutral-900 text-gray-300">
            <UserPrefrenceProvider>
              <SearchProvider>
                <div className="w-full flex flex-col min-h-screen">
                  <header className="sticky top-0 z-50 bg-neutral-900">
                    <Navbar />
                  </header>
                  <main className="flex-grow px-3 py-2">{children}</main>
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
