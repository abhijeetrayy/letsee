import { Countrydata } from "@/staticData/countryName";
import Movie from "@components/clientComponent/movie";
import MovieRecoTile from "@components/movie/recoTiles";

import { Metadata } from "next";

type PageProps = {
  params: Promise<{ id: string }>;
};

// import { likedButton as LikedButton } from "@/components/buttons/intrectionButton";
async function getMovieDetails(id: any) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}`
  );

  const data = await response.json();
  return data;
}

async function getCredit(id: any) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.TMDB_API_KEY}`
  );

  const data = await response.json();
  return data;
}
async function getVideos(id: any) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.TMDB_API_KEY}`
  );

  const data = await response.json();
  return data;
}
async function getImages(id: any) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/images
?api_key=${process.env.TMDB_API_KEY}`
  );

  const data = await response.json();
  return data;
}

async function Reco(id: any) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${process.env.TMDB_API_KEY}`
  );

  const data = await response.json();

  return data;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieDetails(id);

  return {
    title: movie?.title || "Movie Not Found",
    description: movie?.tagline || "Discover amazing movies!",
    openGraph: {
      title: movie?.title || "Movie Not Found",
      description: movie?.tagline || "Discover amazing movies!",
      images: [
        {
          url:
            `https://image.tmdb.org/t/p/w342${movie?.poster_path}` ||
            "/default-image.jpg",
          width: 630,
          height: 1200,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: movie?.title || "Movie Not Found",
      description: movie?.tagline || "Discover amazing movies!",
      images: [
        `https://image.tmdb.org/t/p/w342${movie?.poster_path}` ||
          "/default-image.jpg",
      ],
    },
  };
}

const MovieDetails = async ({ params }: PageProps) => {
  const { id } = await params;
  const movie = await getMovieDetails(id);
  const credits = await getCredit(id);
  const { results: videos } = await getVideos(id);
  const { posters: Pimages, backdrops: Bimages } = await getImages(id);

  const CountryName: any = movie.origin_country.map((name: any) =>
    Countrydata.filter((item: any) => item.iso_3166_1 == name)
  );

  const RecoData = await Reco(id);

  return (
    <div>
      <Movie
        CountryName={CountryName}
        videos={videos}
        Pimages={Pimages}
        Bimages={Bimages}
        movie={movie}
        credits={credits}
        id={id}
      />
      {RecoData.total_results > 0 && (
        <MovieRecoTile title={movie.title} data={RecoData} />
      )}
    </div>
  );
};

export default MovieDetails;
