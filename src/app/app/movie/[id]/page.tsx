import { Countrydata } from "@/staticData/countryName";
import Movie from "@components/clientComponent/movie";
import Head from "next/head";

type PageProps = {
  params: Promise<{ id: string }>;
};

type params = Promise<{ id: string }>;

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

const MovieDetails = async ({ params }: PageProps) => {
  const { id } = await params;
  const movie = await getMovieDetails(id);
  const credits = await getCredit(id);
  const { results: videos } = await getVideos(id);
  const { posters: Pimages, backdrops: Bimages } = await getImages(id);
  console.log(movie.origin_country);
  const CountryName: any = movie.origin_country.map((name: any) =>
    Countrydata.filter((item: any) => item.iso_3166_1 == name)
  );

  const movieTitle = movie.name || "Movie Details";
  const movieOverview = movie.overview || "Check out this movie!";
  const movieImage = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/default-movie.jpg";
  const movieUrl = `https://letsee-dusky.vercel.app/app/movie/${id}`; // Change this to your actual domain

  return (
    <>
      {/* Open Graph & Twitter Meta Tags */}
      <Head>
        <title>{movieTitle} - Watch Details</title>
        <meta name="description" content={movieOverview} />

        {/* Open Graph Meta Tags (for WhatsApp, Facebook, LinkedIn) */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={movieUrl} />
        <meta property="og:title" content={movieTitle} />
        <meta property="og:description" content={movieOverview} />
        <meta property="og:image" content={movieImage} />
        <meta property="og:image:alt" content={movieTitle} />

        {/* Twitter Card Meta Tags (for Twitter, Telegram) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={movieUrl} />
        <meta name="twitter:title" content={movieTitle} />
        <meta name="twitter:description" content={movieOverview} />
        <meta name="twitter:image" content={movieImage} />
      </Head>
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
      </div>
    </>
  );
};

export default MovieDetails;
