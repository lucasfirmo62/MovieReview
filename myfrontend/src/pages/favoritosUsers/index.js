import React, { useEffect, useState } from "react";
import Header from '../../components/header';
import Menu from '../../components/menu';

import HeaderDesktop from "../../components/headerDesktop";

import { useParams } from 'react-router-dom';

import styles from './styles.css';

import api from "../../api";

import { Link } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { FaTimes, FaStar } from 'react-icons/fa';

import Pagination from "../../components/pagination";

const FavoritosUsers = () => {
    let [favoriteList, setFavoriteList] = useState([]);
    let [favoriteUserList, setFavoriteUserList] = useState([]);

    const [favoriteMovieIds, setFavoriteMoviesIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [user, setUser] = useState(null)

    const params = useParams();
    const id = params.id;

    useEffect(() => {
        async function getMovies() {
            let token = localStorage.getItem('tokenUser')
            token = token.substring(1, token.length - 1)

            const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

            // const response = await api.get(`/movies/favoritos/${id}/`, { headers })

            // await setFavoriteUserList(response.data.results)

            const response_favorites = await api.get(`favoritos/`, { headers })

            setFavoriteMoviesIds(response_favorites.data.map(movie => movie.movie_id));

            const favoriteMovies = response_favorites.data.map(movie => ({
                ...movie,
            }));

            await setFavoriteList(favoriteMovies);

            const response_user = await api.get(`/usuarios/${id}/`, { headers })

            setUser(response_user.data)
        }
        getMovies()
    }, [])

    async function clickDesfavoritar(movieId) {
        let token = localStorage.getItem('tokenUser');

        token = token.substring(1, token.length - 1);

        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

        try {
            const index = favoriteList.findIndex(movie => movie.movie_id === movieId);

            if (index !== -1) {
                console.log(favoriteMovieIds)

                await api.delete(`/favoritos/${movieId}/`, { headers });

                setFavoriteList(prevList => {
                    const updatedList = [...prevList];
                    updatedList[index].favorito = false;
                    return updatedList;
                });

                setFavoriteMoviesIds(prevIds => prevIds.filter(id => id !== movieId));
            }

        } catch (error) {
            console.log('Ocorreu um erro ao remover o favorito:', error);
        }

    }

    async function clickFavoritar(movie) {
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

        const headers = {
            Authorization: `Bearer ${loginItem}`,
            "Content-type": "application/json"
        };

        try {
            const index = favoriteList.findIndex(favoriteMovie => favoriteMovie.movie_id === id);

            await api.post('/favoritos/', data, { headers });

            if (index !== -1) {
                setFavoriteList(prevList => {
                    const updatedList = [...prevList];
                    updatedList[index].favorito = true;
                    return updatedList;
                });
            } else {
                const updatedMovie = {
                    ...movie,
                    favorito: true
                };
                setFavoriteList(prevList => [...prevList, updatedMovie]);
            }

            setFavoriteMoviesIds(prevIds => [...prevIds, movie.movie_id]);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        let loginItem;

        if (localStorage.getItem('tokenUser')) {
            loginItem = localStorage.getItem('tokenUser').substring(1, localStorage.getItem('tokenUser').length - 1);
        }

        const headers = {
            Authorization: `Bearer ${loginItem}`,
            "Content-type": "application/json"
        };

        async function get_data() {
            const response = await api.get(`/movies/favoritos/${id}/?page=${currentPage}`, { headers })

            await setTotalPages(Math.ceil(response.data.count / 20))
            await setFavoriteUserList(response.data.results)
        }

        get_data()
    }, [currentPage])

    function handlePageChange(event, pageNumber) {
        event.preventDefault();
        setCurrentPage(pageNumber);
    }

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
                            to={`/user/${id}`}
                            style={{ textDecoration: "none", color: "#fff" }}
                        >
                            <MdArrowBack size={32} className="back-icon" />
                        </Link>
                        <h1 className="title-component">Filmes Favoritos de {user?.nickname}</h1>
                    </div>
                    <div className="favorite-content">
                        {favoriteUserList.map((movie, index) =>
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
                                        {favoriteMovieIds.includes(movie.movie_id) ? (
                                            <button
                                                className="watchlistButton favoriteStarButton"
                                                onClick={() => clickDesfavoritar(movie.movie_id)}
                                            >
                                                <span className="starIcon">
                                                    <FaStar size={16} color="#eecf08" />
                                                </span>
                                            </button>
                                        ) : (

                                            <button
                                                className="watchlistButton favoriteStarButton"
                                                onClick={() => clickFavoritar(movie)}
                                            >
                                                <span className="starIcon">
                                                    <FaStar size={16} color="#fff" />
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="favorite-pagination">
                            <Pagination
                                totalPages={totalPages}
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FavoritosUsers;