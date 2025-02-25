// components/RecommendationTile.tsx
"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import SendMessageModal from "@components/message/sendCard";
import { MdDeleteOutline } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const RecommendationTile = ({ isOwner, name, id }: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [cardData, setCardData] = useState<any>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [modalCanScrollLeft, setModalCanScrollLeft] = useState(false);
  const [modalCanScrollRight, setModalCanScrollRight] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [watchedItems, setWatchedItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const supabase = createClient();

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const userId = userData.user.id;

      const [recoResponse, watchedResponse] = await Promise.all([
        supabase
          .from("recommendation")
          .select("*")
          .eq("user_id", id)
          .order("recommended_at", { ascending: false }),
        supabase
          .from("watched_items")
          .select("*")
          .eq("user_id", id)
          .order("watched_at", { ascending: false })
          .limit(10),
      ]);

      if (recoResponse.error) {
        console.error("Error fetching recommendations:", recoResponse.error);
        setError("Failed to load recommendations");
      } else {
        setRecommendations(recoResponse.data || []);
      }

      if (watchedResponse.error) {
        console.error("Error fetching watched items:", watchedResponse.error);
        setError("Failed to load watched items");
      } else {
        setWatchedItems(watchedResponse.data || []);
      }

      setLoading(false);
    };

    fetchData();
  }, [supabase]);

  // Scroll handling for recommendations
  const handleScroll = useCallback(() => {
    const element = scrollRef.current;
    if (element) {
      const { scrollLeft, scrollWidth, clientWidth } = element;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  }, []);

  const scrollLeft = () => {
    const element = scrollRef.current;
    if (element) {
      const itemWidth = element.querySelector(".card-item")?.clientWidth || 200;
      element.scrollBy({ left: -itemWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    const element = scrollRef.current;
    if (element) {
      const itemWidth = element.querySelector(".card-item")?.clientWidth || 200;
      element.scrollBy({ left: itemWidth, behavior: "smooth" });
    }
  };

  // Scroll handling for modal watched items
  const handleModalScroll = useCallback(() => {
    const element = modalScrollRef.current;
    if (element) {
      const { scrollLeft, scrollWidth, clientWidth } = element;
      setModalCanScrollLeft(scrollLeft > 0);
      setModalCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  }, []);

  const modalScrollLeft = () => {
    const element = modalScrollRef.current;
    if (element) {
      const itemWidth = element.querySelector(".card-item")?.clientWidth || 200;
      element.scrollBy({ left: -itemWidth, behavior: "smooth" });
    }
  };

  const modalScrollRight = () => {
    const element = modalScrollRef.current;
    if (element) {
      const itemWidth = element.querySelector(".card-item")?.clientWidth || 200;
      element.scrollBy({ left: itemWidth, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => element.removeEventListener("scroll", handleScroll);
    }
  }, [recommendations, handleScroll]);

  useEffect(() => {
    const element = modalScrollRef.current;
    if (element && isModalOpen) {
      element.addEventListener("scroll", handleModalScroll);
      handleModalScroll();
      return () => element.removeEventListener("scroll", handleModalScroll);
    }
  }, [watchedItems, isModalOpen, handleModalScroll]);

  // Search watched items
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      setSearchLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("watched_items")
      .select("*")
      .eq("user_id", userData.user.id)
      .ilike("item_name", `%${searchQuery}%`)
      .order("item_name", { ascending: true })
      .limit(10);

    setSearchLoading(false);
    if (error) {
      console.error("Error searching watched items:", error);
      setSearchResults([]);
    } else {
      setSearchResults(data || []);
    }
  };

  // Add to recommendations
  const handleAddToRecommendations = async (item: any) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    setActionLoading((prev) => ({ ...prev, [`add-${item.id}`]: true }));

    const { error } = await supabase.from("recommendation").insert({
      user_id: userData.user.id,
      item_id: item.item_id,
      name: item.item_name,
      item_type: item.item_type,
      image: item.image_url,
      adult: item.item_adult,
    });

    if (error) {
      console.error("Error adding to recommendations:", error);
    } else {
      const { data: updatedData } = await supabase
        .from("recommendation")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("recommended_at", { ascending: false });
      setRecommendations(updatedData || []);
      setSearchResults((prev) => prev.filter((i) => i.id !== item.id));
    }

    setActionLoading((prev) => ({ ...prev, [`add-${item.id}`]: false }));
  };

  // Remove from recommendations
  const handleRemove = async (itemId: number) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    setActionLoading((prev) => ({ ...prev, [`remove-${itemId}`]: true }));

    const { error } = await supabase
      .from("recommendation")
      .delete()
      .eq("user_id", userData.user.id)
      .eq("item_id", itemId);

    if (error) {
      console.error("Error removing recommendation:", error);
    } else {
      setRecommendations((prev) =>
        prev.filter((item) => item.item_id !== itemId)
      );
      setSearchResults((prev) =>
        prev.map((i) =>
          i.item_id === itemId ? { ...i, recommended: false } : i
        )
      );
    }

    setActionLoading((prev) => ({ ...prev, [`remove-${itemId}`]: false }));
  };

  // Check if item is in recommendations
  const isRecommended = (itemId: number) =>
    recommendations.some((rec) => rec.item_id === itemId);

  if (error) return <p className="text-red-400 text-center">{error}</p>;

  return (
    <div className="w-full rounded-md bg-neutral-800 p-5 mb-5 ">
      {/* Recommendation Modal */}
      {isModalOpen && isOwner && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 ">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-neutral-900 rounded-lg p-6 overflow-y-auto thin-scroll">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 bg-neutral-800 text-white p-2 w-10 h-10 rounded-full hover:bg-neutral-700 transition-colors duration-200"
            >
              X
            </button>
            <h2 className="text-xl font-bold text-neutral-100 mb-4">
              Add to Recommendations
            </h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search your watched items..."
                className="w-full p-2 bg-neutral-800 text-neutral-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={searchLoading}
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed"
                disabled={searchLoading}
              >
                {searchLoading ? (
                  <AiOutlineLoading3Quarters className="animate-spin" />
                ) : (
                  "Search"
                )}
              </button>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="bg-neutral-700 rounded-md overflow-hidden flex flex-col justify-between h-auto group relative"
                  >
                    <img
                      className="w-full h-40 object-cover"
                      src={
                        item.item_adult
                          ? "/pixeled.webp"
                          : item.image_url
                          ? `https://image.tmdb.org/t/p/w185/${item.image_url}`
                          : "/no-photo.webp"
                      }
                      alt={item.item_name}
                    />
                    <div className="p-2 bg-neutral-900">
                      <p className="text-sm text-neutral-100 line-clamp-2">
                        {item.item_name}
                      </p>
                      <button
                        onClick={() =>
                          isRecommended(item.item_id)
                            ? handleRemove(item.item_id)
                            : handleAddToRecommendations(item)
                        }
                        className="mt-2 w-full bg-blue-600 text-white py-1 px-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed"
                        disabled={
                          actionLoading[`add-${item.id}`] ||
                          actionLoading[`remove-${item.item_id}`]
                        }
                      >
                        {actionLoading[`add-${item.id}`] ||
                        actionLoading[`remove-${item.item_id}`] ? (
                          <AiOutlineLoading3Quarters className="animate-spin" />
                        ) : isRecommended(item.item_id) ? (
                          <MdDeleteOutline />
                        ) : (
                          "Add"
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Recent Watched Items Section */}
            <div className="mt-6 relative">
              <h1 className="text-lg font-bold text-neutral-100 mb-4">
                Recently Watched
              </h1>
              <div
                ref={modalScrollRef}
                className="flex flex-row gap-4 py-3 overflow-x-auto no-scrollbar"
              >
                {watchedItems.length > 0 ? (
                  watchedItems.map((item) => (
                    <div
                      key={item.id}
                      className="card-item w-32 h-auto rounded-md overflow-hidden flex-shrink-0 flex flex-col justify-between group relative"
                    >
                      <div className="absolute top-0 left-0">
                        <p className="px-1 py-1 bg-neutral-950 text-white rounded-br-md text-xs">
                          {item.item_type}
                        </p>
                      </div>
                      <Link
                        className="w-full h-full"
                        href={`/app/${item.item_type}/${item.item_id}-${(
                          item.item_name || ""
                        )
                          .trim()
                          .replace(/[^a-zA-Z0-9]/g, "-")
                          .replace(/-+/g, "-")}`}
                      >
                        <img
                          className="w-full h-full object-cover"
                          src={
                            item.item_adult
                              ? "/pixeled.webp"
                              : item.image_url
                              ? `https://image.tmdb.org/t/p/w185/${item.image_url}`
                              : "/no-photo.webp"
                          }
                          alt={item.item_name}
                        />
                      </Link>
                      <button
                        onClick={() =>
                          isRecommended(item.item_id)
                            ? handleRemove(item.item_id)
                            : handleAddToRecommendations(item)
                        }
                        className="mt-2 w-full h-10 bg-blue-600 text-white py-1 px-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed"
                        disabled={
                          actionLoading[`add-${item.id}`] ||
                          actionLoading[`remove-${item.item_id}`]
                        }
                      >
                        {actionLoading[`add-${item.id}`] ||
                        actionLoading[`remove-${item.item_id}`] ? (
                          <AiOutlineLoading3Quarters className="animate-spin" />
                        ) : isRecommended(item.item_id) ? (
                          <MdDeleteOutline />
                        ) : (
                          "Add"
                        )}
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-neutral-400 text-center w-full">
                    No recently watched items
                  </p>
                )}
              </div>
              {modalCanScrollLeft && (
                <button
                  onClick={modalScrollLeft}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-neutral-800 text-neutral-100 p-2 rounded-full hover:bg-neutral-700 transition-colors duration-200 z-10 shadow-md"
                >
                  <FaChevronLeft size={16} />
                </button>
              )}
              {modalCanScrollRight && (
                <button
                  onClick={modalScrollRight}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-neutral-800 text-neutral-100 p-2 rounded-full hover:bg-neutral-700 transition-colors duration-200 z-10 shadow-md"
                >
                  <FaChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Section */}
      <div className="min-h-64 h-full relative">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-neutral-100">
            {isOwner
              ? "ShowCase Your Recommendations"
              : `Recommendation from ${name}`}
          </h1>
          {isOwner && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Add Recommendation
            </button>
          )}
        </div>
        {loading ? (
          <p className="text-neutral-400 text-center">Loading...</p>
        ) : (
          <div
            ref={scrollRef}
            className="flex flex-row gap-4 py-3 overflow-x-auto no-scrollbar"
          >
            {recommendations.length > 0 ? (
              recommendations.map((item) => (
                <div
                  key={item.id}
                  className="card-item min-w-[10rem]  bg-neutral-700 rounded-md overflow-hidden flex-shrink-0 flex flex-col justify-between h-auto group relative"
                >
                  <div className="absolute top-0 left-0">
                    <p className="px-1 py-1 bg-neutral-950 text-white rounded-br-md text-xs sm:text-sm">
                      {item.item_type}
                    </p>
                  </div>
                  <Link
                    className="w-full h-full"
                    href={`/app/${item.item_type}/${item.item_id}-${(
                      item.name || ""
                    )
                      .trim()
                      .replace(/[^a-zA-Z0-9]/g, "-")
                      .replace(/-+/g, "-")}`}
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={
                        item.adult
                          ? "/pixeled.webp"
                          : item.image
                          ? `https://image.tmdb.org/t/p/w185/${item.image}`
                          : "/no-photo.webp"
                      }
                      alt={item.name}
                    />
                  </Link>
                  <div className="w-full h-[100px] bg-indigo-700 bottom-0 flex flex-col justify-between">
                    <div className="w-full flex items-center justify-center bg-neutral-700">
                      {isOwner && (
                        <button
                          onClick={() => handleRemove(item.item_id)}
                          className="h-full w-full flex items-center justify-center hover:bg-neutral-600 font-bold text-3xl py-1"
                          disabled={actionLoading[`remove-${item.item_id}`]}
                        >
                          {actionLoading[`remove-${item.item_id}`] ? (
                            <AiOutlineLoading3Quarters className="animate-spin" />
                          ) : (
                            <MdDeleteOutline />
                          )}
                        </button>
                      )}
                    </div>
                    <Link
                      className="h-full flex items-center justify-center text-neutral-100 hover:underline"
                      href={`/app/${item.item_type}/${item.item_id}-${(
                        item.name || ""
                      )
                        .trim()
                        .replace(/[^a-zA-Z0-9]/g, "-")
                        .replace(/-+/g, "-")}`}
                    >
                      <span>
                        {item.name &&
                          (item.name.length > 16
                            ? item.name.slice(0, 14) + ".."
                            : item.name)}
                      </span>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-neutral-400 text-center w-full">
                No recommendations available
              </p>
            )}
          </div>
        )}

        {/* Fade Overlays */}
        <div
          className={`hidden md:block absolute top-0 left-0 h-full w-12 sm:w-20 bg-gradient-to-r from-black to-transparent pointer-events-none transition-opacity duration-300 ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`hidden md:block absolute top-0 right-0 h-full w-12 sm:w-20 bg-gradient-to-l from-black to-transparent pointer-events-none transition-opacity duration-300 ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Scroll Buttons */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="hidden md:block absolute left-2 top-1/2 transform -translate-y-1/2 bg-neutral-800 text-neutral-100 p-2 sm:p-3 rounded-full hover:bg-neutral-700 transition-colors duration-200 z-10 shadow-md"
          >
            <FaChevronLeft size={20} />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="hidden md:block absolute right-2 top-1/2 transform -translate-y-1/2 bg-neutral-800 text-neutral-100 p-2 sm:p-3 rounded-full hover:bg-neutral-700 transition-colors duration-200 z-10 shadow-md"
          >
            <FaChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default RecommendationTile;
