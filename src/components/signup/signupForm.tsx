import Link from "next/link";
import React, { useState } from "react";

type LoginFormProps = {
  onSignup: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error: string;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSignup, loading, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    await onSignup(email, password);
  };

  return (
    <div className="w-full min-h-screen flex flex-col p-2 justify-center items-center bg-neutral-900">
      <div className="w-full z-10">
        <div
          className={
            loading
              ? "animate-bounce m-auto w-fit text-neutral-100 mb-5"
              : "m-auto w-fit text-neutral-100 mb-5"
          }
        >
          <h1 className="text-7xl font-extrabold text-neutral-100">
            Let&apos;s See
          </h1>
          <p>Social media for cinema.</p>
        </div>
        <form className={"flex flex-col max-w-sm w-full m-auto gap-2"}>
          <label className="text-neutral-100 pl-2" htmlFor="email">
            Email
          </label>
          <input
            className="text-neutral-700 ring-0 outline-0 px-3 focus:ring-2 rounded-sm focus:ring-indigo-600 py-2"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="text-neutral-100 pl-2" htmlFor="password">
            New Password
          </label>
          <input
            className="text-neutral-700 ring-0 outline-0 px-3 focus:ring-2 rounded-sm focus:ring-indigo-600 py-2"
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex flex-col gap-3 mt-3">
            <button
              className="text-neutral-100 bg-indigo-700 py-2 rounded-md w-full hover:bg-indigo-600"
              type="button"
              onClick={() => handleSubmit()}
              disabled={loading}
            >
              Sign up
            </button>

            <p className="m-auto text-white">
              already have an account,
              <Link className="pl-2 text-blue-500 underline" href={"/login"}>
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
