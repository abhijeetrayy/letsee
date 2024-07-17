// pages/api/movies.js
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
 
export async function POST(req: NextRequest) {
    const requestClone = req.clone();
  const body = await requestClone.json();
  const genreId = body.genre

   
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=${genreId.id}`);
       
        return NextResponse.json(response.data.results,{status: 200});
    } catch (error) {
        return NextResponse.json(error,{status:500});
    }
}