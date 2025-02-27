import UserPrefrenceProvider from "@/app/contextAPI/userPrefrenceProvider";
import Footbar from "@/components/footbar/foot";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "react-hot-toast";

async function getUsername() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const { data: profileData } = await supabase
    .from("users")
    .select("*")
    .eq("id", userData.user?.id)
    .single();

  return profileData;
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profileData = await getUsername();

  if (!profileData?.username) {
    // return <SetupComp />;
    console.log("no username");
  }

  return (
    // <AuthProvider>
    <div className="w-full font-inter flex flex-col justify-center bg-neutral-900 text-gray-300">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <UserPrefrenceProvider>
        <div className="w-full flex flex-col min-h-screen">
          <main className="flex-grow px-3 py-2">{children}</main>
          <Footbar />
        </div>
      </UserPrefrenceProvider>
    </div>
  );
}
