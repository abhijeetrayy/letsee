"use client";
import { useSearch } from "@/app/contextAPI/searchContext";
import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function Page() {
  const [Sresults, setSResults] = useState([]) as any;
  const [loading, setLoading] = useState(false);
  const { setIsSearchLoading } = useSearch();

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const { query } = params;

  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query, page }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setSResults(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsSearchLoading(false);
        setLoading(false);
      }
    };

    fetchData();
  }, [query, page, setIsSearchLoading]);

  const changePage = (newPage: number) => {
    setLoading(true);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", newPage.toString());
    router.push(`/app/search/${query}?${newSearchParams.toString()}`);
  };

  return (
    <div className="min-h-screen mx-auto w-full max-w-7xl">
      {Sresults.total_results > 0 && (
        <div>
          <p>
            Search Results: {decodeURIComponent(query as string)} '
            {Sresults?.total_results}' items
          </p>
        </div>
      )}
      {loading ? (
        <div className="min-h-screen w-full flex justify-center items-center">
          Loading..
        </div>
      ) : (
        <div>
          <div className="text-white  w-full   my-4">
            {Sresults.total_results == 0 && (
              <div className="flex flex-col h-full w-full gap-5 items-center justify-center">
                <p className="text-lg">
                  Result for "
                  <span className="text-pink-600">
                    {decodeURIComponent(query as string)}
                  </span>
                  "{" "}
                  <span className="font-bold text-purple-600">
                    is not found
                  </span>{" "}
                  - or check you spelling{" "}
                </p>
                <img src="/abhijeetray.webp" alt="not-found" />
              </div>
            )}
            <div className="w-fit m-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Sresults?.results?.map(
                (data: any) =>
                  data?.media_type !== "person" && (
                    <div
                      key={data.id}
                      className="relative group flex flex-col bg-neutral-900 w-full h-full text-gray-300  duration-300 rounded-md overflow-hidden lg:hover:scale-105 hover:z-10"
                    >
                      <div className="absolute top-0 left-0 flex flex-row justify-between w-full z-10">
                        <p className="p-1 bg-black text-white rounded-br-md text-sm">
                          {data.media_type}
                        </p>
                        {(data.release_date || data.first_air_date) && (
                          <p className="p-1 bg-indigo-600 text-white rounded-bl-md text-sm">
                            {new Date(data.release_date).getFullYear() ||
                              new Date(data.first_air_date).getFullYear()}
                          </p>
                        )}
                      </div>
                      <Link
                        href={`/app/${data.media_type}/${data.id}-${(
                          data.name || data.title
                        )
                          .trim()
                          .replace(/[^a-zA-Z0-9]/g, "-")
                          .replace(/-+/g, "-")}`}
                        className="h-full w-full"
                      >
                        <img
                          className="relative object-cover w-full h-[230px] md:h-[300px] lg:h-full "
                          src={
                            data.poster_path || data.backdrop_path
                              ? `https://image.tmdb.org/t/p/w342${
                                  data.poster_path || data.backdrop_path
                                }`
                              : "/no-photo.webp"
                          }
                          alt={data.title}
                        />
                      </Link>

                      <div className=" lg:absolute lg:bottom-0 w-full bg-neutral-900 lg:opacity-0 lg:group-hover:opacity-100">
                        <ThreePrefrenceBtn
                          cardId={data.id}
                          cardType={data.media_type}
                          cardName={data.name || data.title}
                          cardAdult={data.adult}
                          cardImg={data.poster_path || data.backdrop_path}
                        />

                        <div
                          title={data.name || data.title}
                          className="w-full flex flex-col gap-2 px-4 bg-indigo-700 text-gray-200 lg:opacity-0 lg:group-hover:opacity-100"
                        >
                          <Link
                            href={`/app/${data.media_type}/${data.id}-${(
                              data.name || data.title
                            )
                              .trim()
                              .replace(/[^a-zA-Z0-9]/g, "-")
                              .replace(/-+/g, "-")}`}
                            className="mb-1"
                          >
                            <span className="">
                              {data?.title
                                ? data.title.length > 20
                                  ? data.title?.slice(0, 20) + "..."
                                  : data.title
                                : data.name.length > 20
                                ? data.name?.slice(0, 20) + "..."
                                : data.name}
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
              )}
              {Sresults?.results?.map(
                (data: any) =>
                  data?.media_type == "person" && (
                    <div
                      key={data.id}
                      className="relative group flex flex-col bg-indigo-700 w-full h-full pb-2 text-gray-300 rounded-md overflow-hidden duration-300 lg:hover:scale-105 hover:z-20"
                    >
                      <div className="absolute top-0 left-0 flex flex-row justify-between w-full z-10">
                        <p className="p-1 bg-black text-white rounded-br-md text-sm">
                          {data.media_type}
                        </p>
                      </div>
                      <Link
                        className="h-full w-full"
                        href={`/app/person/${data.id}-${data.name
                          .trim()
                          .replace(/[^a-zA-Z0-9]/g, "-")
                          .replace(/-+/g, "-")}`}
                      >
                        <img
                          className="relative  object-cover h-[230px] md:h-[300px] w-full  "
                          src={
                            data.profile_path
                              ? `https://image.tmdb.org/t/p/h632${data.profile_path}`
                              : "/no-photo.webp"
                          }
                          width={400}
                          height={400}
                          alt={data.title}
                        />
                      </Link>
                      <span className="bg-indigo-700  flex flex-col gap-3 py-2  hlimitSearch px-2 text-gray-300 ">
                        <div className="">
                          <Link
                            className="group-hover:underline"
                            href={`/app/person/${data.id}-${data.name
                              .trim()
                              .replace(/[^a-zA-Z0-9]/g, "-")
                              .replace(/-+/g, "-")}`}
                          >
                            {data.name.length > 16
                              ? data.name.slice(0, 14) + ".."
                              : data.name}
                          </Link>
                        </div>

                        <div className=" text-xs underline ">
                          {data.known_for_department}
                        </div>
                      </span>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      )}
      {Sresults?.total_pages > 1 && (
        <div className="flex flex-row justify-center items-center ">
          <div className=" my-3 ">
            <button
              className="px-4 py-2 bg-neutral-700 rounded-md hover:bg-neutral-600"
              onClick={() => changePage(page - 1)}
              disabled={page === 1}
            >
              Last
            </button>
            <span className="mx-4">
              Page {page} of {Sresults.total_pages}
            </span>
            <button
              className="px-4 py-2 bg-neutral-700 rounded-md hover:bg-neutral-600"
              onClick={() => changePage(page + 1)}
              disabled={page === Sresults.total_pages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
