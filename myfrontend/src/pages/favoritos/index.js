import React, { useEffect, useState } from "react";
import Header from '../../components/header';
import Menu from '../../components/menu';

import styles from './styles.css';

import api from "../../api";

import { Link } from "react-router-dom";

const Favoritos = () => {
  var [favoriteList, setFavoriteList] = useState([]);

  useEffect(() => {
    async function getMovies() {
      let id = localStorage.getItem('idUser')
      let token = localStorage.getItem('tokenUser')

      id = id.substring(1, id.length - 1)
      token = token.substring(1, token.length - 1)

      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

      const response = await api.get('/favoritos/', { headers })

      await setFavoriteList(response.data)
    }
    getMovies()
  }, [])

  async function clickDesfavoritar(index) {
    let id = localStorage.getItem('idUser');
    let token = localStorage.getItem('tokenUser');

    id = id.substring(1, id.length - 1);
    token = token.substring(1, token.length - 1);

    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    try {
      await api.delete(`/favoritos/${index}/`, { headers });

      setFavoriteList(prevList => {
        const updatedList = [...prevList];
        updatedList.splice(index, 1);
        return updatedList;
      });
    } catch (error) {
      console.log('Ocorreu um erro ao remover o favorito:', error);
    }

    window.location.reload();
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
            <big className="title-component">Meus Filmes Favoritos</big>
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
                    >
                      <p className="movieTitle">{movie.movie_title}</p>
                    </Link>
                  </div>
                  <div className="button-content">
                    <button className="favoriteButton" onClick={() => clickDesfavoritar(movie.movie_id)} >Desfavoritar</button>
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