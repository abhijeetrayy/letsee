import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function loading() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 overflow-hidden">
      <AiOutlineLoading3Quarters className="absolute size-12 text-white animate-spin" />
    </div>
  );
}

export default loading;
