import React, { useEffect, useState } from "react";
import Header from '../../components/header';
import HeaderDesktop from "../../components/headerDesktop";
import Menu from '../../components/menu';

import styles from './styles.css';

import api from "../../api";

import { Link } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { FaTimes, FaStar } from 'react-icons/fa';

const Favoritos = () => {
  var [favoriteList, setFavoriteList] = useState([]);

  useEffect(() => {
    async function getMovies() {
      const response = await api.get('/favoritos/')


      const favoriteMovies = response.data.map(movie => ({
        ...movie,
        favorito: true
      }));

      await setFavoriteList(favoriteMovies);
    }
    getMovies()
  }, [])

  async function clickDesfavoritar(movieId) {
    try {
      const index = favoriteList.findIndex(movie => movie.movie_id === movieId);

      if (index !== -1) {
        setFavoriteList(prevList => {
          const updatedList = [...prevList];
          updatedList[index].favorito = false;
          return updatedList;
        });

        await api.delete(`/favoritos/${movieId}/`);
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
      const index = favoriteList.findIndex(movie => movie.movie_id === id);

      await api.post('/favoritos/', data, { headers })

      if (index !== -1) {
        setFavoriteList(prevList => {
          const updatedList = [...prevList];
          updatedList[index].favorito = true;
          return updatedList;
        });
      }
    } catch (error) {
      console.log(error)
    }
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
                to={'/profile/'}
                style={{ textDecoration: "none", color: "#fff" }}
              >
                <MdArrowBack size={32} className="back-icon" />
              </Link>
              <h1 className="title-component">Filmes Favoritos</h1>
          </div>
          <div className="favorite-content">
            {favoriteList.map((movie, index) =>
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
                    {movie.favorito ? (

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

export default Favoritos;