// // components/WatchOptionsViewer.tsx
// "use client";
// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";

// interface WatchProvider {
//   provider_id: number;
//   provider_name: string;
//   logo_path: string;
// }

// interface WatchOptionsProps {
//   mediaId: number; // Movie or TV show ID
//   mediaType: "movie" | "tv"; // Type of media
//   country?: string; // ISO 3166-1 code (e.g., "US")
// }

// const WatchOptionsViewer: React.FC<WatchOptionsProps> = ({
//   mediaId,
//   mediaType,
//   country = "US",
// }) => {
//   const [watchLink, setWatchLink] = useState<string>(""); // TMDb watch page link
//   const [providers, setProviders] = useState<WatchProvider[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch watch providers from TMDb
//   useEffect(() => {
//     const fetchWatchProviders = async () => {
//       setLoading(true);
//       setError(null);

//       const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
//       if (!apiKey) {
//         setError("TMDb API key is missing");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await fetch(
//           `https://api.themoviedb.org/3/${mediaType}/${mediaId}/watch/providers?api_key=${apiKey}`
//         );
//         if (!response.ok) {
//           throw new Error(`Failed to fetch providers: ${response.status}`);
//         }
//         const data = await response.json();

//         // Extract providers and link for the specified country
//         const countryData = data.results[country];
//         if (!countryData) {
//           setProviders([]);
//           setWatchLink("");
//           setError("No providers available in this country");
//         } else {
//           // Use the TMDb watch link
//           setWatchLink(countryData.link || "");

//           // Combine flatrate (streaming), rent, and buy providers
//           const allProviders = [
//             ...(countryData.flatrate || []),
//             ...(countryData.rent || []),
//             ...(countryData.buy || []),
//           ].reduce((unique, provider) => {
//             return unique.some(
//               (p: any) => p.provider_id === provider.provider_id
//             )
//               ? unique
//               : [...unique, provider];
//           }, [] as WatchProvider[]);
//           setProviders(allProviders);
//         }
//       } catch (err) {
//         setError((err as Error).message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWatchProviders();
//   }, [mediaId, mediaType, country]);

//   // Fallback URLs for major providers (optional, if deep links are desired)
//   const providerFallbackUrls: { [key: number]: string } = {
//     8: "https://www.netflix.com", // Netflix
//     9: "https://www.amazon.com/Prime-Video", // Amazon Prime Video
//     15: "https://www.hulu.com", // Hulu
//     337: "https://www.disneyplus.com", // Disney+
//     257: "https://www.hbo.com", // HBO Max
//     // Add more as needed
//   };

//   if (loading) {
//     return (
//       <p className="text-neutral-400 text-center">Loading watch options...</p>
//     );
//   }

//   if (error) {
//     return <p className="text-red-400 text-center">Error: {error}</p>;
//   }

//   return (
//     <div className="w-full max-w-3xl mx-auto">
//       <h2 className="text-lg sm:text-xl font-semibold text-neutral-100 mb-4 text-center">
//         Where to Watch
//       </h2>
//       {providers.length > 0 ? (
//         <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
//           {providers.map((provider) => {
//             // Prefer TMDb watch link, fallback to provider homepage
//             const providerLink =
//               watchLink || providerFallbackUrls[provider.provider_id] || "#";

//             return (
//               <Link
//                 key={provider.provider_id}
//                 href={providerLink}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex flex-col items-center w-20 sm:w-24 hover:opacity-80 transition-opacity duration-200"
//               >
//                 <Image
//                   src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
//                   alt={provider.provider_name}
//                   width={64}
//                   height={64}
//                   className="rounded-md object-contain"
//                 />
//                 <span className="text-xs sm:text-sm text-neutral-200 text-center mt-2">
//                   {provider.provider_name}
//                 </span>
//               </Link>
//             );
//           })}
//         </div>
//       ) : (
//         <p className="text-neutral-400 text-center">
//           No streaming options available in {country}.
//         </p>
//       )}
//       <p className="text-xs text-neutral-500 text-center mt-4">
//         Data provided by JustWatch via TMDb
//       </p>
//     </div>
//   );
// };

// export default WatchOptionsViewer;
