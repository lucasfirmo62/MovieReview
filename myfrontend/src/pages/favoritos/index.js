import React from "react";
import Header from '../../components/header';
import Menu from '../../components/menu';
import styles from  './styles.css';

const Favoritos = () => {
   var favoriteList = [];



  return (
    <>
      <Header />
      <div className="content-page">
        <div className="left-content">
          <Menu/>
        </div>
        <div className="center-content">        
            <div className = "title-content">
                <big className = "title-component">Meus Filmes Favoritos</big>                
            </div>
            <div className = "favorite-content">
                  <div className="favoriteMovie-component">
                    <div className="moviePicture">                      
                    </div>
                    <div className="movieInfo">
                          <p className="movieTitle">Nome do Filme</p>
                    </div>
                    <div class="favoriteButton">
                      <button class="unfavoriteButton">Desfavoritar</button>
                    </div>
                  </div>
            </div>
        </div>
      </div>
    </>
  )
}

export default Favoritos;