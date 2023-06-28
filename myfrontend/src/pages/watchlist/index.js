import React, { useEffect, useState, useRef } from "react";
import Header from '../../components/header';
import HeaderDesktop from "../../components/headerDesktop";
import Menu from '../../components/menu';

import styles from './styles.css';

import api from "../../api";

import { Link, useParams, useLocation } from "react-router-dom";

import { FaTimes, FaStar } from 'react-icons/fa';
import { MdArrowBack } from "react-icons/md";
import { AiFillEye } from 'react-icons/ai';

const Watchlist = () => {
    const { id } = useParams();

    const location = useLocation()

    var [Watchlist, setWatchlist] = useState([]);
    var [page, setPage] = useState(1);
    const isFirstPageRef = useRef(false);

    const backButtonRoute = location.state?.prevPath;

    const getMovies = async () => {
        if (page === 1) {
            isFirstPageRef.current = true;
        }

        const response = await api.get(`/watchlist/user/${id}/?page=${page}`);

        console.log(response.data.results)

        const watchlistMovies = response.data.results.map(movie => ({
            ...movie,
            watchlist: movie.watchlist
        }));

        setWatchlist((prevPublications) => [
            ...prevPublications,
            ...watchlistMovies,
        ]);
    };

    const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        if (isFirstPageRef.current === false || page !== 1) {
            getMovies();
        }
    }, [page]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    async function toggleRemoveToWatchlist(movieId) {
        try {
            const index = Watchlist.findIndex(movie => movie.movie_id === movieId);

            if (index !== -1) {
                setWatchlist(prevList => {
                    const updatedList = [...prevList];
                    updatedList[index].watchlist = false;
                    return updatedList;
                });

                await api.delete(`watchlist/movie/${movieId}/`);
            }
        } catch (error) {
            console.log('Ocorreu um erro ao remover na watchlist:', error);
        }
    }

    async function toggleAddToWatchlist(movie) {
        let id = movie.movie_id

        const data = {
            "user_id": localStorage.getItem('idUser'),
            "movie_id": movie.movie_id,
            "poster_img": `https://image.tmdb.org/t/p/w500/${movie.poster_img}`,
            "movie_title": movie.movie_title
        }

        let loginItem;

        if (localStorage.getItem('tokenUser')) {
            loginItem = localStorage.getItem('tokenUser').substring(1, localStorage.getItem('tokenUser').length - 1);
        }

        try {
            const index = Watchlist.findIndex(movie => movie.movie_id === id);

            await api.post('/watchlist/', data)

            if (index !== -1) {
                setWatchlist(prevList => {
                    const updatedList = [...prevList];
                    updatedList[index].watchlist = true;
                    return updatedList;
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    console.log(Watchlist.length)

    return (
        <>
            {(window.innerWidth > 760) ?
                <HeaderDesktop />
                :

                <Header />
            }
            <div className="content-page">
                <div className="left-content">
                    <Menu />
                </div>
                <div className="center-content">
                    <div className="title-content">
                        <Link
                            className="back-btn"
                            to={backButtonRoute}
                            style={{ textDecoration: "none", color: "#fff" }}
                        >
                            <MdArrowBack size={32} className="back-icon" />
                        </Link>
                        <h1 className="title-component">Assistir no futuro</h1>
                    </div>
                    <div className="favorite-content">
                        {Watchlist.map((movie, index) =>
                        (
                            <div key={index} className="favoriteMovie-component">
                                <img className="moviePicture" src={movie.poster_img} />
                                <div className="infoFavorite-movie">
                                    <div className="movieInfo">
                                        <Link
                                            className="movie-favorite-item"
                                            to={`/movie/${movie.movie_id}`}
                                            style={{ textDecoration: "none", color: "#fff" }}
                                        >
                                            <p className="movieTitle">{movie.movie_title}</p>
                                        </Link>
                                    </div>

                                    <div className="button-content">
                                        {movie.watchlist ? (

                                            <button
                                                className="watchlistButton"
                                                onClick={() => toggleRemoveToWatchlist(movie.movie_id)}
                                            >
                                                <span className="closeIcon">
                                                    <AiFillEye className="pink-eye" size={18} />
                                                </span>
                                            </button>
                                        ) : (

                                            <button
                                                className="watchlistButton"
                                                onClick={() => toggleAddToWatchlist(movie)}
                                            >
                                                <span className="closeIcon">
                                                    <AiFillEye color="#fff" size={18} />
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </>
    )
}

export default Watchlist;