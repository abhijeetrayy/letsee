// pages/api/movies.js
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
 
export async function POST(req: NextRequest) {
    const requestClone = req.clone();
  const body = await requestClone.json();
  const queryString = body.query
  console.log(queryString)

   
    try {
        const response = await fetch( `https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API_KEY}&query=${queryString}`
        );
        const show = await response.json()
       console.log(show)
        return NextResponse.json(show.results,{status: 200});
    } catch (error) {
        return NextResponse.json(error,{status:500});
    }
}