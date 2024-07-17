import React from "react";

function cardMovieButton({ icon, text, movieId }: any) {
  return (
    <>
      <button title={text} className=" p-1 border border-white rounded-md">
        {icon}
      </button>
    </>
  );
}

export default cardMovieButton;
