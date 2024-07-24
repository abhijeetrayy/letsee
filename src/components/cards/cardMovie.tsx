import Image from "next/image";
import CardMovieButton from "@/components/buttons/cardMovieButton";
import { MdOutlineDownloadDone } from "react-icons/md";
import { CiSaveDown1 } from "react-icons/ci";
import { FcLike } from "react-icons/fc";
import Link from "next/link";
import { IoEyeOutline } from "react-icons/io5";

async function getMovie(id: any) {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=${id}`
  );

  const data = await response.json();
  return data.results;
}

async function CardMovie({ genre }: any) {
  const movies = await getMovie(genre.id);

  // const [movies, setMovies] = useState([]);
  // const scrollableDivRef = useRef(null);

  // const namePosition = () => {
  //   const scrollableDiv = scrollableDivRef.current;
  //   const length = scrollableDiv.scrollLeft;

  //   const elements = scrollableDiv.getElementsByClassName("changePosition");
  //   for (let i = 0; i < elements.length; i++) {
  //     elements[i].style.marginLeft = `${length}px`;
  //   }
  // };

  // useEffect(() => {
  //   async function getMovie() {
  //     const res = await fetch(`/api/movie`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ genre }),
  //     });
  //     if (!res.ok) {
  //       return;
  //     }
  //     const data = await res.json();
  //     setMovies(data || []);
  //   }
  //   getMovie();
  // }, [genre]);

  // useEffect(() => {
  //   const scrollableDiv = scrollableDivRef.current;
  //   scrollableDiv.addEventListener("scroll", namePosition);
  //   return () => {
  //     scrollableDiv.removeEventListener("scroll", namePosition);
  //   };
  // }, []);

  return (
    <>
      <div className="w-full  pb-7 ">
        <h2 className=" changePosition text-lg  text-white whitespace-nowrap">
          {genre.name} :-
        </h2>
        <div className="w-full mt-4">
          <div className="flex my-2 p-1.5 py-3 moveChildOne">
            {movies?.slice(0, 6).map((movie: any) => (
              <div
                key={movie.id}
                className=" relative group flex flex-col  bg-neutral-950 mr-2.5 max-w-72 min-h-64 text-gray-300 rounded-md shadow-md shadow-black  duration-300  hover:scale-125 hover:z-50"
              >
                <Image
                  className="rounded-md w-full object-cover max-h-48 group-hover:opacity-30"
                  src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                  width={200}
                  height={200}
                  quality={40}
                  alt={movie.title}
                />
                <span className=" flex flex-col gap-3  hlimit px-4 absolute bottom-3  translate-y-0 duration-300 group-hover:bottom-20 group-hover:text-white group-hover:text-sm">
                  <div className="mb-1">
                    <Link
                      className="group-hover:underline"
                      href={`/app/movie/${movie.id}`}
                    >
                      {movie.title}
                    </Link>
                  </div>
                  <p className="text-xs mb-1 group-hover:text-[10px]">
                    {movie.release_date}
                  </p>
                  <p className=" text-xs group-hover:text-[10px]">
                    {movie.overview}
                  </p>
                </span>
                <div className="p-4 flex flex-row gap-5 absolute bottom-4 right-3 transform  opacity-0 group-hover:-translate-x-16 group-hover:opacity-100 transition-transform duration-500">
                  <CardMovieButton
                    movieId={movie.id}
                    text={"watched"}
                    icon={<IoEyeOutline />}
                  />
                  <CardMovieButton
                    movieId={movie.id}
                    text={"watched"}
                    icon={<FcLike />}
                  />
                  <CardMovieButton
                    movieId={movie.id}
                    text={"save"}
                    icon={<CiSaveDown1 />}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* <div
        ref={scrollableDivRef}
        className="w-full overflow-x-scroll pb-7 no-scrollbar"
      >
        <h2 className=" changePosition text-lg  text-white whitespace-nowrap">
          {genre.name} :-
        </h2>
        <div className="w-full mt-4">
          <div className="flex grow gap-1 my-2 p-1.5 py-3 moveChildOne">
            {movies.length === 0 ? (
              <div className="flex flex-col justify-center items-center gap-3 bg-black mr-2.5 min-w-72 min-h-72  text-gray-300 rounded-md border border-gray-800 cursor-default duration-300 hover:min-w-96 hover:z-50">
                <p>Loading</p>
              </div>
            ) : (
              movies.map((movie) => (
                <div
                  key={movie.id}
                  className="relative group flex flex-col  bg-black mr-2.5 min-w-72 min-h-72 max-h-72 text-gray-300 rounded-md border border-gray-800  duration-300  hover:scale-125 hover:z-50"
                >
                  <Image
                    className="rounded-md max-w-full max-h-48 group-hover:opacity-30"
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    width={500}
                    height={500}
                    quality={20}
                    alt={movie.title}
                  />
                  <span className=" flex flex-col gap-6  hlimit px-4 absolute bottom-5  translate-y-0 duration-300 group-hover:bottom-36 group-hover:text-white">
                    <Link
                      className="group-hover:underline"
                      href={`/movie/${movie.id}`}
                    >
                      {movie.title}
                    </Link>
                    <h6 className="text-xs">{movie.release_date}</h6>
                    <h6 className=" text-xs">{movie.overview}</h6>
                  </span>
                  <div className="p-4 flex flex-row gap-5 absolute bottom-4 right-3 transform  opacity-0 group-hover:-translate-x-32 group-hover:opacity-100 transition-transform duration-500">
                    <CardMovieButton
                      movieId={movie.id}
                      text={"watched"}
                      icon={<FcLike />}
                    />
                    <CardMovieButton
                      movieId={movie.id}
                      text={"save"}
                      icon={<CiSaveDown1 />}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div> */}
      {/* <div className="w-full flex justify-center">
          <div className="rounded-lg border border-gray-400 max-w-lg w-full"></div>
        </div> */}
    </>
  );
}

export default CardMovie;
