// import React, { useState } from "react";

// function arrowbuttonScroll() {
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(false);
//   return (
//     <div>
//       {/* Left Fade Overlay */}
//       <div
//         className={`absolute top-0 left-0 h-full w-12 sm:w-16 bg-gradient-to-r from-black to-transparent pointer-events-none transition-opacity duration-300 ${
//           canScrollLeft ? "opacity-100" : "opacity-0"
//         }`}
//       />

//       {/* Right Fade Overlay */}
//       <div
//         className={`absolute top-0 right-0 h-full w-12 sm:w-16 bg-gradient-to-l from-black to-transparent pointer-events-none transition-opacity duration-300 ${
//           canScrollRight ? "opacity-100" : "opacity-0"
//         }`}
//       />

//       {/* Scroll Buttons */}
//       {canScrollLeft && (
//         <button
//           onClick={scrollLeft}
//           className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-neutral-800 text-neutral-100 p-2 sm:p-3 rounded-full hover:bg-neutral-700 transition-colors duration-200 z-10 shadow-md"
//         >
//           <FaChevronLeft size={16} className="sm:size-20" />
//         </button>
//       )}
//       {canScrollRight && (
//         <button
//           onClick={scrollRight}
//           className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-neutral-800 text-neutral-100 p-2 sm:p-3 rounded-full hover:bg-neutral-700 transition-colors duration-200 z-10 shadow-md"
//         >
//           <FaChevronRight size={16} className="sm:size-20" />
//         </button>
//       )}
//     </div>
//   );
// }

// export default arrowbuttonScroll;
