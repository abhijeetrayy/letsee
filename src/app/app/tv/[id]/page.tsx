import Tv from "@components/clientComponent/tv";
import MovieRecoTile from "@components/movie/recoTiles";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

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

async function Reco(id: any) {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/similar?api_key=${process.env.TMDB_API_KEY}`
  );

  const data = await response.json();

  return data;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await getShowDetails(id);

  return {
    title: movie?.name || "Movie Not Found",
    description: movie?.tagline || "Discover amazing movie/tv!",
    openGraph: {
      title: movie?.name || "Movie Not Found",
      description: movie?.tagline || "Discover amazing movie/tv!",
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
      title: movie?.name || "Movie Not Found",
      description: movie?.tagline || "Discover amazing movie/tv!",
      images: [
        `https://image.tmdb.org/t/p/w342${movie?.poster_path}` ||
          "/default-image.jpg",
      ],
    },
  };
}

const ShowDetails = async ({ params }: PageProps) => {
  const { id } = await params;
  const show = await getShowDetails(id);
  const ExternalIDs = await getExternalIds(id);
  const { cast, crew } = await getShowCredit(id);
  const { results: videos } = await getVideos(id);
  const { posters: Pimages, backdrops: Bimages } = await getImages(id);
  const RecoData = await Reco(id);

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
      {RecoData.total_results > 0 && (
        <MovieRecoTile type={"tv"} title={show.name} data={RecoData} />
      )}
    </div>
  );
};

export default ShowDetails;
