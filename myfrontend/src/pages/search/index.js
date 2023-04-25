import React, { useEffect, useState } from "react";
import "./styles.css";

import axios from "axios";

import Header from "../../components/header";
import Pagination from "../../components/pagination";

import { useLocation, Link } from "react-router-dom";

import MovieFilter from "../../components/movieFilter";

import { FaFilter } from "react-icons/fa";

import posternotfound from "../../assets/posternotfound.png";

const Search = () => {
  const [showImage, setShowImage] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const { search } = useLocation();

  const params = new URLSearchParams(search);

  const query = params.get("query");

  const [beforeQuery, setBeforeQuery] = useState("");

  const [movies, setMovies] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterWork, setIsFilterWork] = useState(false);

  const [genres, setGenres] = useState([]);
  const [year, setYear] = useState("");
  const [sortby, setSortBy] = useState("");

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 760px)");

    setShowImage(mediaQuery.matches);

    const handleResize = () => {
      setShowImage(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      let response;

      if (isFilterWork) {
        response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=pt-BR&with_genres=${genres}&with_text_query=${query}&year=${year}&sort_by=${sortby}&page=${currentPage}`
        );
      } else {
        if (query !== beforeQuery) {
          setCurrentPage(1);
        }

        response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${query}&page=${currentPage}&language=pt-BR`
        );
      }

      const results = response.data.results;
      setMovies(results);
      setTotalPages(response.data.total_pages);
      setBeforeQuery(query);
    }

    fetchData();
  }, [isFilterWork, query, currentPage, genres, year, sortby, beforeQuery]);

  function filterMovies(year, genres, rating) {
    setYear(year);
    setGenres(genres);

    const sortBy = rating === "asc" ? "vote_average.asc" : "vote_average.desc";
    setSortBy(sortBy);

    async function fetchData() {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=pt-BR&with_genres=${genres}&with_text_query=${query}&year=${year}&sort_by=${sortBy}&page=${currentPage}`
      );

      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
      setCurrentPage(1);
    }

    if (year !== "" || genres.length > 0 || rating !== "") {
      setIsFilterWork(true);
      fetchData();
    } else {
      window.location.reload();
      setIsFilterWork(false);
    }
  }

  function handlePageChange(event, pageNumber) {
    event.preventDefault();
    setCurrentPage(pageNumber);
  }

  return (
    <>
      <Header />

      <div className="search-container ">
        <div className="search-content">
          <div className="search-results">
            {movies.length > 0 ? (
              <h2>Resultados da busca por "{query}"</h2>
            ) : (
              <h2>Não foram encontrados resultados por "{query}"</h2>
            )}
            <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
              {movies.map((movie) => (
                <li key={movie.id}>
                  <Link
                    className="movie-item"
                    to={`/movie/${movie.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                          : posternotfound
                      }
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

            {movies.length > 0 ? (
              <Pagination
                totalPages={totalPages < 5 ? totalPages : 5}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            ) : (
              true
            )}
          </div>

          <div>
            {showImage && (
              <div className="filter-toggle" onClick={toggleFilter}>
                <FaFilter /> Filtro
              </div>
            )}

            {(!showImage || (showImage && showFilter)) && (
              <MovieFilter filterMovies={filterMovies} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
