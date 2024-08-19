import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import localfont from "next/font/local";
import "../globals.css";
import UserPrefrenceProvider from "@/app/contextAPI/userPrefrenceProvider";
import Footbar from "@/components/footbar/foot";
import Navbar from "@/components/header/navbar";
import { ToastContainer } from "react-toastify";
import { SearchProvider } from "../contextAPI/searchContext";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SetupComp from "@/components/setupComponents/SetupComp";

// const inter = Inter({ subsets: ["latin"] });

const inter = localfont({
  src: [{ path: "../../../public/font/Inter.ttf", weight: "400" }],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Unisocial",
  description: "created by Uni Pvt",
};

async function getUsername() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  const { data: profileData }: any = await supabase
    .from("users")
    .select("*")
    .eq("id", userData.user?.id)
    .single();
  console.log(profileData, "bb");
  return { profileData };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { profileData } = await getUsername();
  console.log(profileData, "aa");
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
