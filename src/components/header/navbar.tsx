import Link from "next/link";
import SignOut from "../buttons/signOut";

function navbar() {
  return (
    <div className="w-full flex flex-row items-center justify-between text-white max-w-7xl h-full">
      <div className="">
        <Link href={"/app"}>Let's see</Link>
      </div>

      <div className="flex flex-row gap-3">
        <div>
          <input className="border-2 border-black" type="text" />
        </div>

        <div>Notify</div>
        <div className=" group relative inline-block text-left">
          <div>
            <button
              type="button"
              className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              id="menu-button"
              aria-expanded="true"
              aria-haspopup="true"
            >
              Options
              <svg
                className="-mr-1 h-5 w-5 text-gray-400 group-hover:rotate-180 duration-300"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="hidden absolute right-0 z-10  border-transparent w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5  group-hover:block focus:outline-none duration-300">
            <div className="py-1">
              <div className="block px-4 py-2 text-sm text-gray-700">
                Account settings
              </div>
              <div className="block px-4 py-2 text-sm text-gray-700">
                Support
              </div>
              <div className="block px-4 py-2 text-sm text-gray-700">
                License
              </div>
              <div className="block px-4 py-2 text-sm text-gray-700">
                <SignOut />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default navbar;