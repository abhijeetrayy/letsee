"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

interface RecommendationTileProps {
  isOwner: boolean;
  name: string;
  id: string;
}

interface Item {
  id: number;
  item_id: number;
  item_name: string;
  item_type: string;
  image_url?: string;
  item_adult?: boolean;
  recommended?: boolean;
}

const RecommendationTile = ({ isOwner, name, id }: RecommendationTileProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [cardData, setCardData] = useState<any>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [modalCanScrollLeft, setModalCanScrollLeft] = useState(false);
  const [modalCanScrollRight, setModalCanScrollRight] = useState(false);
  const [recommendations, setRecommendations] = useState<Item[]>([]);
  const [watchedItems, setWatchedItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<{
    [key: string]: boolean;
  }>({});

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/recommendations", {
          method: "POST", // Using POST to send user_id in body
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: id }),
        });

        if (!response.ok) {
          throw new Error("Failed to load data");
        }

        const data = await response.json();
        console.log(data.recommendations);
        setRecommendations(data.recommendations || []);
        setWatchedItems(data.watchedItems || []);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
    try {
      const response = await fetch("/api/recommendations/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error("Error searching watched items");
      }
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Add to recommendations
  const handleAddToRecommendations = async (item: Item) => {
    setActionLoading((prev) => ({ ...prev, [`add-${item.id}`]: true }));
    try {
      const response = await fetch("/api/recommendations/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_id: item.item_id,
          name: item.item_name,
          item_type: item.item_type,
          image: item.image_url,
          adult: item.item_adult,
        }),
      });

      if (!response.ok) {
        throw new Error("Error adding to recommendations");
      }

      const updatedReco = await response.json();
      setRecommendations(updatedReco.recommendations || []);
      setSearchResults((prev) => prev.filter((i) => i.id !== item.id));
    } catch (error) {
      console.error("Add error:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, [`add-${item.id}`]: false }));
    }
  };

  // Remove from recommendations
  const handleRemove = async (itemId: number) => {
    setActionLoading((prev) => ({ ...prev, [`remove-${itemId}`]: true }));
    try {
      const response = await fetch("/api/recommendations/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: itemId }),
      });

      if (!response.ok) {
        throw new Error("Error removing recommendation");
      }

      setRecommendations((prev) =>
        prev.filter((item) => item.item_id !== itemId)
      );
      setSearchResults((prev) =>
        prev.map((i) =>
          i.item_id === itemId ? { ...i, recommended: false } : i
        )
      );
    } catch (error) {
      console.error("Remove error:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, [`remove-${itemId}`]: false }));
    }
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
      <div className="flex justify-between flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold text-neutral-100">
          {isOwner
            ? "ShowCase Your Recommendations"
            : `Recommendation from ${name}`}
        </h1>
        {isOwner && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white text-sm md:text-md py-1 px-3 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Add Recommendation
          </button>
        )}
      </div>
      <div className="min-h-64 h-full relative">
        {loading ? (
          <p className="text-neutral-400 text-center">Loading...</p>
        ) : (
          <div
            ref={scrollRef}
            className="flex flex-row gap-4 py-3 overflow-x-auto no-scrollbar"
          >
            {recommendations.length > 0 ? (
              recommendations.map((item: any) => (
                <div
                  key={item.id}
                  className="card-item w-full max-w-[6rem] md:max-w-[10rem] bg-neutral-700 rounded-md overflow-hidden flex-shrink-0 flex flex-col justify-between h-auto group relative"
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
                      className="h-full flex items-center justify-center text-sm md:text-base text-neutral-100 hover:underline"
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
