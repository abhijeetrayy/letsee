"use client";
import React, { useState } from "react";

function Biography({ biography }: any) {
  const [showFullOverview, setShowFullOverview] = useState(false);

  const toggleOverview = () => {
    setShowFullOverview(!showFullOverview);
  };

  return (
    <div className="my-4 text-neutral-300">
      <p>
        {showFullOverview ? biography : biography.slice(0, 300)}
        {biography.length > 300 && !showFullOverview && "..."}
      </p>
      {biography.length > 300 && (
        <button
          onClick={toggleOverview}
          className="text-blue-500 hover:text-blue-400 mt-2"
        >
          {showFullOverview ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
}

export default Biography;
