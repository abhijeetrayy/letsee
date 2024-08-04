import { login, signup } from "./action";
import Button from "@/components/buttons/button";
import { createClient } from "@/utils/supabase/client";

export default async function LoginPage(this: any) {
  const supabase = createClient();
  // async function socialAuth(provider: Provider) {
  //   // https://supabase.com/docs/guides/auth/server-side/oauth-with-pkce-flow-for-ssr
  //   await supabase.auth.signInWithOAuth({
  //     provider,
  //     options: {
  //       redirectTo: `${location.origin}/auth/callback`,
  //     },
  //   });
  // }
  return (
    <div className=" w-full min-h-screen flex flex-col justify-center items-center bg-neutral-900 ">
      {/* <img
        className="absolute top-0 left-0 h-full w-full opacity-30"
        src="/backgroundjpeg.jpeg"
        alt="let's see"
      /> */}
      <div className="z-10 "></div>
      <div className="w-full z-10">
        <div className="m-auto w-fit text-neutral-100 mb-5">
          <h1 className="text-7xl  font-extrabold text-neutral-100 ">
            Let's See
          </h1>
          <p>Social media for cinema.</p>
        </div>
        <form className="flex flex-col max-w-sm  w-full m-auto gap-2">
          <label className="text-neutral-100 pl-2" htmlFor="email">
            Email
          </label>
          <input
            className="text-neutral-700 ring-0 outline-0 px-3 focus:ring-2 rounded-sm focus:ring-indigo-600 py-2"
            id="email"
            name="email"
            type="email"
            required
          />
          <label className="text-neutral-100 pl-2" htmlFor="password">
            Password
          </label>
          <input
            className="text-neutral-700 ring-0 outline-0 px-3 focus:ring-2 rounded-sm focus:ring-indigo-600 py-2"
            id="password"
            name="password"
            type="password"
            required
          />
          <span> </span>
          <button
            className="text-neutral-100 bg-indigo-700 py-2  rounded-md w-full hover:bg-indigo-600"
            formAction={login}
          >
            Log in
          </button>
          <button
            className="text-neutral-100 bg-indigo-700 py-2  rounded-md w-full hover:bg-indigo-600"
            formAction={signup}
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}
