import React, { useState } from "react";
import Header from '../../components/header';
import Menu from '../../components/menu';
import styles from './styles.css';

const Favoritos = () => {
  var [favoriteList, auxFavoriteList] = useState(['Filme 1', 'Filme 2', 'Filme 3', 'Filme 4']);

  const clickDesfavoritar = (index) => {
    const updatedList = [...favoriteList];
    updatedList.splice(index, 1);
    auxFavoriteList(updatedList);
  };

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
                <div className="moviePicture">
                </div>
                <div className="infoFavorite-movie">
                  <div className="movieInfo">
                    <p className="movieTitle">{movie}</p>
                  </div>
                  <div className="button-content">
                    <button className="favoriteButton" onClick={() => clickDesfavoritar(index)} >Desfavoritar</button>
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