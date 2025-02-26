"use client";

import React, { useEffect, useState } from "react";

function imdbRating({ id }: any) {
  const [imdbRating, setImdbRating] = useState("loading..");

  useEffect(() => {
    const fetchImdb = async () => {
      setImdbRating("loading..");

      try {
        const response = await fetch(
          `https://www.omdbapi.com/?i=${id}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`
        );
        const res = await response.json();
        console.log(res);
        if (res.Response == "False") {
          setImdbRating("N/A");
        } else setImdbRating(res.imdbRating);
      } catch (error) {
        console.log(error);
        setImdbRating("null");
      }
    };
    fetchImdb();
  }, []);
  return (
    <p className={imdbRating !== "loading" || "null" ? "font-bold" : ""}>
      {imdbRating !== "loading.." ? `${imdbRating}` : "Loading.."}
    </p>
  );
}

export default imdbRating;
