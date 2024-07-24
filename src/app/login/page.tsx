'use client'
import { Provider } from "@supabase/supabase-js";
import { login, signup } from "./action";
import Button from "@/components/buttons/button";
import { createClient } from "@/utils/supabase/client";

export default async function LoginPage(this: any) {
  const supabase = createClient()
  async function socialAuth(provider: Provider) {
    // https://supabase.com/docs/guides/auth/server-side/oauth-with-pkce-flow-for-ssr
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  }
  return (<>
    <form className="">
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login}>Log in</button>
      <button formAction={signup}>Sign up</button>
    </form>
    <div>
      <button onClick={socialAuth.bind(this, 'google')}>GOOGLE</button>
      <button onClick={socialAuth.bind(this, 'github')}>GITHUB</button>
    </div>
  </>
  );
}
