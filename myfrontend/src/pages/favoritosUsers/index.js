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

const FavoritosUsers = () => {

    let [favoriteUserList, setFavoriteUserList] = useState([]);

    const [user, setUser] = useState(null)

    const params = useParams();
    const id = params.id;

    useEffect(() => {
        async function getMovies() {
            let token = localStorage.getItem('tokenUser')
            token = token.substring(1, token.length - 1)

            const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

            const response = await api.get(`/favoritos/`, { headers })

            await setFavoriteUserList(response.data) 
        }
        getMovies()
    }, [])

    async function clickDesfavoritar(movieId) {
    
    }

    async function clickFavoritar(movie) {
       
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
                                        {false ? (
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

                    </div>
                </div>
            </div>
        </>
    )
}

export default FavoritosUsers;