import React, { useEffect, useState } from "react";
import Header from '../../components/header';
import Menu from '../../components/menu';

import styles from './styles.css';

import api from "../../api";

import { Link } from "react-router-dom";

import { FaTimes, FaStar } from 'react-icons/fa';
import { MdArrowBack } from "react-icons/md";

const Watchlist = () => {
    var [Watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        async function getMovies() {
            let id = localStorage.getItem('idUser')
            let token = localStorage.getItem('tokenUser')

            id = id.substring(1, id.length - 1)
            token = token.substring(1, token.length - 1)

            const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

            const response = await api.get('/favoritos/', { headers })

            await setWatchlist(response.data)
        }
        getMovies()
    }, [])

    async function toggleRemoveToWatchlist() {
      
    }

    async function toggleAddToWatchlist() {
       
    }

    return (
        <>
            <Header />
            <div className="content-page">
                <div className="left-content">
                    <Menu />
                </div>
                <div className="center-content">
                    <div className="title-content">
                        <Link
                            className="back-btn"
                            to={'/profile/'}
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
                                        <button className="watchlistButton">
                                            <span className="closeIcon">
                                            <FaTimes size={14} />
                                        </span></button>
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