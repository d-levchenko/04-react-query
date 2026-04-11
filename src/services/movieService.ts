import axios from 'axios';
import type { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const token = import.meta.env.VITE_TMDB_TOKEN;

interface TmdbResponse {
  total_results: number;
  total_pages: number;
  page: number;
  results: Movie[];
}

const mapThroughFilms = (films: Movie) => {
  return {
    id: films.id,
    poster_path: films.poster_path,
    backdrop_path: films.backdrop_path,
    title: films.title,
    overview: films.overview,
    release_date: films.release_date,
    vote_average: films.vote_average,
  };
};

const fetchMovies = async (
  query: string,
  page: number,
): Promise<TmdbResponse> => {
  const { data } = await axios.get<TmdbResponse>(`${BASE_URL}/search/movie`, {
    params: { query: query, page: page },
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    total_pages: data.total_pages,
    total_results: data.total_results,
    results: data.results.map(mapThroughFilms),
    page: data.page,
  };
};

export default fetchMovies;
