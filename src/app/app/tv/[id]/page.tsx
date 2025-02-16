import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";
import Tv from "@components/clientComponent/tv";
import MovieCast from "@components/movie/MovieCast";
import Video from "@components/movie/Video";
import Link from "next/link";
import { LiaImdb } from "react-icons/lia";

async function getShowDetails(id: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.TMDB_API_KEY}`
  );

  const data = await response.json();
  return data;
}
async function getShowCredit(id: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`
  );

  const data = await response.json();
  return data;
}
async function getVideos(id: any) {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${process.env.TMDB_API_KEY}`
  );

  const data = await response.json();
  return data;
}
async function getImages(id: any) {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/images?api_key=${process.env.TMDB_API_KEY}`
  );

  const data = await response.json();
  return data;
}

async function getExternalIds(id: any) {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/external_ids?api_key=${process.env.TMDB_API_KEY}`
  );

  const data = await response.json();
  return data;
}
interface PageProps {
  params: Promise<{ id: string }>;
}

const ShowDetails = async ({ params }: PageProps) => {
  const { id } = await params;
  const show = await getShowDetails(id);
  const ExternalIDs = await getExternalIds(id);
  const { cast, crew } = await getShowCredit(id);
  const { results: videos } = await getVideos(id);
  const { posters: Pimages, backdrops: Bimages } = await getImages(id);

  return (
    <div>
      <Tv
        show={show}
        ExternalIDs={ExternalIDs}
        videos={videos}
        Pimages={Pimages}
        Bimages={Bimages}
        cast={cast}
        crew={crew}
        id={id}
      />
    </div>
  );
};

export default ShowDetails;
