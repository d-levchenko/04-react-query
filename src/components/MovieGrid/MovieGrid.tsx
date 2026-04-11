import type { Movie } from '../../types/movie';
import css from './MovieGrid.module.css';

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

const MovieGrid = ({ movies, onSelect }: MovieGridProps) => {
  return (
    <ul className={css.grid}>
      {movies.map(elem => (
        <li onClick={() => onSelect(elem)}>
          <div className={css.card}>
            <img
              className={css.image}
              src={`https://image.tmdb.org/t/p/w500${elem.poster_path}`}
              alt={elem.title}
              loading="lazy"
            />
            <h2 className={css.title}>{elem.title}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MovieGrid;
