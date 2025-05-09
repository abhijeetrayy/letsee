"use client";
import Link from "next/link";
import { useState } from "react";

import ThreePrefrenceBtn from "@components/buttons/threePrefrencebtn";
import SendMessageModal from "@components/message/sendCard";
import { LuSend } from "react-icons/lu";

interface MovieRecommendation {
  name: string;
  poster_url: string | null;
  id: string;
  genres: any;
}

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<MovieRecommendation[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardData, setCardData] = useState([]) as any;

  const handleCardTransfer = (data: any) => {
    setCardData(data);
    setIsModalOpen(true);
  };

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/AiRecommendation`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch recommendations");
      }

      const data: MovieRecommendation[] = await response.json();
      console.log(data);
      setRecommendations(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <SendMessageModal
        media_type={"movie"}
        data={cardData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <button
        onClick={handleGetRecommendations}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 mb-6"
      >
        {isLoading ? "Generating..." : "Get Recommendations"}
      </button>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}

      {recommendations.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 ">
          {recommendations.map((data) => (
            <div className="" key={data.id}>
              <div className=" relative group flex flex-col justify-between rounded-md bg-black  w-full h-full  text-gray-300 overflow-hidden duration-300   ">
                <Link
                  className="relative flex h-full  "
                  href={`/app/movie/${data.id}-${data.name
                    .trim()
                    .replace(/[^a-zA-Z0-9]/g, "-")
                    .replace(/-+/g, "-")}`}
                >
                  <img
                    className={`${"h-full w-full object-cover"}  `}
                    src={data.poster_url ? data.poster_url : "/no-photo"}
                    loading="lazy"
                    alt={data.name}
                  />
                </Link>
                <div className="lg:absolute bottom-0 w-full bg-neutral-900 lg:opacity-0 lg:group-hover:opacity-100 z-10">
                  <ThreePrefrenceBtn
                    genres={data.genres}
                    data={data}
                    cardId={data.id}
                    cardType={"movie"}
                    cardName={data.name}
                    cardAdult={false}
                    cardImg={data.poster_url}
                  />
                  <div className="py-2 border-t border-neutral-950 bg-neutral-800 hover:bg-neutral-700">
                    <button
                      className="w-full  flex justify-center text-lg text-center "
                      onClick={() => handleCardTransfer(data)}
                    >
                      <LuSend />
                    </button>
                  </div>

                  <div
                    title={data.name}
                    className="w-full h-12 lg:h-fit flex flex-col gap-2  px-4  bg-indigo-700  text-gray-200 "
                  >
                    <Link
                      href={`/app/movie/${data.id}-${data.name
                        .trim()
                        .replace(/[^a-zA-Z0-9]/g, "-")
                        .replace(/-+/g, "-")}`}
                      className="h-full"
                    >
                      <span className="">
                        {data.name.length > 20
                          ? data.name?.slice(0, 20) + "..."
                          : data.name}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
