"use client";
import React, { useState } from "react";

function Page() {
  const [update, setUpdate] = useState("Click to update");
  const [isLoading, setIsLoading] = useState(false);

  const updateGenre = async () => {
    setIsLoading(true);
    setUpdate("Updating...");

    try {
      const response = await fetch("/api/update-genres", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to update genres: ${response.statusText}`);
      }

      const data = await response.json();
      setUpdate(data.message || "Genres updated successfully");
    } catch (error) {
      console.error("Error updating genres:", error);
      setUpdate("Failed to update genres");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={updateGenre} disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Genres"}
      </button>
      <p>{update}</p>
    </div>
  );
}

export default Page;
