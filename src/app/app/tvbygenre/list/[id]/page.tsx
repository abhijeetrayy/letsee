"use client";
import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function Page() {
  const [Sresults, setSResults] = useState([]) as any;
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const { id } = params;

  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/genreSearchtv", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ genreId: id, page }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data);
        setSResults(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [id, page]);

  const changePage = (newPage: number) => {
    setLoading(true);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", newPage.toString());
    router.push(`/app/tvbygenre/list/${id}?${newSearchParams.toString()}`);
  };

  return (
    <div className="min-h-screen mx-auto w-full max-w-7xl">
      <div>
        <p>
          Search Results: {decodeURIComponent(id as string)} '
          {Sresults?.total_results}' items
        </p>
      </div>
      {loading ? (
        <div className="min-h-screen w-full flex justify-center items-center">
          Loading..
        </div>
      ) : (
        <div>
          <div className="text-white  w-full my-4">
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Sresults?.results?.map((data: any) => (
                <div
                  key={data.id}
                  className=" overflow-hidden relative group flex flex-col  w-full h-full text-gray-300 rounded-sm   duration-300  hover:scale-105 hover:z-20"
                >
                  <div className="absolute  top-0 left-0 flex flex-row justify-between w-full z-20">
                    <p className="p-1 bg-black text-white rounded-br-md text-sm">
                      Tv
                    </p>
                    {(data.release_date || data.first_air_date) && (
                      <p className="p-1 bg-indigo-600 text-white rounded-bl-md text-sm">
                        {new Date(data.release_date).getFullYear() ||
                          new Date(data.first_air_date).getFullYear()}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/app/tv/${data.id}-${(data.title || data.name)
                      .trim()
                      .replace(/[^a-zA-Z0-9]/g, "-")
                      .replace(/-+/g, "-")}`}
                    className=" w-full"
                  >
                    <img
                      className="relative rounded-md object-cover max-w-full h-fit "
                      src={
                        data.poster_path || data.backdrop_path
                          ? `https://image.tmdb.org/t/p/w342${
                              data.poster_path || data.backdrop_path
                            }`
                          : "/no-photo.jpg"
                      }
                      width={400}
                      height={400}
                      alt={data.title}
                    />
                  </Link>

                  <div className="lg:absolute bottom-0 w-full bg-neutral-900 lg:opacity-0 lg:group-hover:opacity-100 z-10">
                    <ThreePrefrenceBtn
                      cardId={data.id}
                      cardType={"tv"}
                      cardName={data.name || data.title}
                      cardAdult={data.adult}
                      cardImg={data.poster_path || data.backdrop_path}
                    />

                    <div
                      title={data.name || data.title}
                      className="w-full flex flex-col gap-2  px-4  bg-indigo-700  text-gray-200 "
                    >
                      <Link
                        href={`/app/${data.media_type}/${data.id}--${(
                          data.name || data.title
                        )
                          .trim()
                          .replace(/[^a-zA-Z0-9]/g, "-")
                          .replace(/-+/g, "-")}}`}
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
              ))}
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
