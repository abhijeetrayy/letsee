import ThreeUserPrefrenceBtn from "@/components/buttons/threePrefrencebtn";
import MovieCast from "@/components/movie/MovieCast";
import Video from "@/components/movie/Video";
import { Countrydata } from "@/staticData/countryName";
import Movie from "@components/clientComponent/movie";
import Link from "next/link";
import { LiaImdb } from "react-icons/lia";

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

const MovieDetails = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const { id }: any = params;
  const movie = await getMovieDetails(id);
  const credits = await getCredit(id);
  const { results: videos } = await getVideos(id);
  const { posters: Pimages, backdrops: Bimages } = await getImages(id);
  console.log(movie.origin_country);
  const CountryName: any = movie.origin_country.map((name: any) =>
    Countrydata.filter((item: any) => item.iso_3166_1 == name)
  );

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
    </div>
  );
};

export default MovieDetails;
