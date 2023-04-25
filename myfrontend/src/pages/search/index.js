import React, { useEffect, useState } from "react";
import './styles.css'

import axios from 'axios';

import Header from '../../components/header';
import Pagination from '../../components/pagination';

import {
    useLocation,
    Link
} from 'react-router-dom';

import posternotfound from '../../assets/posternotfound.png'

const Search = () => {
    const { search } = useLocation();
    const params = new URLSearchParams(search);

    const query = params.get('query');

    const [movies, setMovies] = useState([]);

    const [beforeQuery, setBeforeQuery] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        async function fetchData() {
          const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${query}&page=${currentPage}&language=pt-BR`;
      
          if (query !== beforeQuery) {
            setCurrentPage(1);
          }
      
          const { data } = await axios.get(url);
          const { results, total_pages } = data;
      
          setBeforeQuery(query);
          setMovies(results);
          setTotalPages(total_pages);
        }
      
        fetchData();
      }, [query, currentPage, beforeQuery]);

    function handlePageChange(event, pageNumber) {
        event.preventDefault();
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    }

    return (
        <>
            <Header />

            <div className="search-container">
                <div className="search-content">

                    <h2>{movies.length > 0
                        ? `Resultados da busca por "${query}"`
                        : `Não foram encontrados resultados por "${query}"`}
                    </h2>

                    <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
                        {movies.map((movie) => (
                            <li key={movie.id}>
                                <Link className="movie-item" to={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
                                    <img
                                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : posternotfound}
                                        alt={movie.title}
                                    />
                                    <div className="movie-details">
                                        <h3>{movie.title}</h3>
                                        <p>({new Date(movie.release_date).getFullYear()})</p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {movies.length > 0 && (
                        <Pagination
                            totalPages={totalPages < 5 ? totalPages : 5}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    )}

                </div>
            </div>
        </>
    )
}

export default Search;
