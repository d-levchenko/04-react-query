import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactPaginateModule from 'react-paginate';
import type { ReactPaginateProps } from 'react-paginate';
import type { ComponentType } from 'react';

import SearchBar from '../SearchBar/SearchBar';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';

import fetchMovies from '../../services/movieService';
import type { Movie } from '../../types/movie';

import css from './App.module.css';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', search, page],
    queryFn: () => fetchMovies(search, page),
    enabled: !!search,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data.results.length === 0 && search) {
      toast.error('No films found for your request.');
    }
  }, [isSuccess, data, search]);

  const handleSearch = async (query: string) => {
    setSearch(query);
    setPage(1);
    setSelectedMovie(null);
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleModalClose = () => {
    setSelectedMovie(null);
  };

  const handlePageChange = (event: { selected: number }) => {
    setPage(event.selected + 1);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {isSuccess && data.total_pages > 1 && (
        <ReactPaginate
          pageCount={data.total_pages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={handlePageChange}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isLoading && <Loader />}
      {isError && !isLoading && <ErrorMessage />}
      {isSuccess && data && data.results.length > 0 && (
        <MovieGrid movies={data.results} onSelect={handleMovieSelect} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleModalClose} />
      )}
    </>
  );
}
