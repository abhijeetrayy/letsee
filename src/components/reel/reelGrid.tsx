// components/GenreGrid.tsx
import React from "react";

const genres = [
  { id: 1, name: "Romance" },
  { id: 2, name: "Drama" },
  { id: 3, name: "Action" },
  { id: 4, name: "Happiness" },
  { id: 5, name: "Slow" },
];

const GenreGrid: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {genres.map((genre) => (
          <div
            key={genre.id}
            className="bg-gray-100 rounded-lg p-6 text-center hover:bg-gray-200 transition-colors duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {genre.name}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenreGrid;
