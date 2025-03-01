import Link from "next/link";

export default function ErrorPage() {
  return (
    <p className=" bg-neutral-700 text-white w-full h-screen flex justify-center items-center flex-col gap-3">
      Sorry, something went wrong{" "}
      <Link
        href={"/login"}
        className="px-3 py-2 bg-neutral-600 rounded-md hover:bg-neutral-500"
      >
        Log in
      </Link>
    </p>
  );
}
