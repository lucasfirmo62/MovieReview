import React, { useState, useEffect } from "react";
import './styles.css';
import { AiFillPlusCircle } from 'react-icons/ai';
import axios from 'axios';

const Publication = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState('');
    const [postText, setPostText] = useState('');

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
                params: {
                    api_key: '91e9bea62105d3ed0765acbbd25020bd',
                    query: searchQuery,
                    language: 'pt-BR',
                },
            });
            setMovies(response.data.results);
            setSelectedMovie("");
        } catch (error) {
            console.error(error);
        }
    };

    setTimeout(function () {
        if ((document.getElementById("review-text").value).length > 0) {
            document.getElementById("align-post-review").style.display = "block"
        }
    }, 100);


    const handleMovieSelect = (event) => {
        setSelectedMovie(event.target.value);
        document.getElementById("align-post-review").style.display = "block"
        document.getElementById("button-handleSubmit").style.display = "block"
    };

    async function addMovie() {
        document.getElementById("publication-movie-content").style.display = "block"
    }

    async function handleSubmit() {

        if((document.getElementById("review-text").value).length < 100 && (document.getElementById("button-handleSubmit").style.display === "block")){
            document.getElementById("alert").innerHTML = "A critica precisa ter mais de 100 caracteres para ser publicada."
        }

        if (((document.getElementById("review-text").value).length > 100) && (document.getElementById("button-handleSubmit").style.display === "block")) {
            alert("critica publicada")
        }



    };

    async function seeBest() {
        document.getElementById("review-text").style.height = "200px"
        document.getElementById("button-cancel").style.display = "block"
    }

    async function cancelPost() {
        document.getElementById("review-text").style.height = "20px"
        document.getElementById("review-text").value = ""

        document.getElementById("button-cancel").style.display = "none"
        document.getElementById("publication-movie-content").style.display = "none"
        document.getElementById("align-post-review").style.display = "none"
        document.getElementById("button-handleSubmit").style.display = "none"
    }


    return (
        <>
            <div className="publication-content">
                <div className="publication-text-content">
                    <div className="content-conf-review-write">
                        <img
                            className="user-image"
                            src="https://ibaseminario.com.br/novo/wp-content/uploads/2013/09/default-avatar.png"
                            alt="user-photo"
                        />
                        <button onClick={cancelPost} id="button-cancel" className="button-cancel">Cancelar</button>
                    </div>
                    <textarea
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        placeholder="Adicionar uma Crítica sobre um filme"
                        id="review-text"
                        onClick={seeBest}
                    />
                </div>

                <button onClick={addMovie} className="button-add-movie"><AiFillPlusCircle className="plus-icon" />Adicionar filme</button>
                <br />

                <form onSubmit={handleSearchSubmit}>
                    <div className="content-post-review">
                        <div id="publication-movie-content" className="publication-movie-content">
                            <div className="content-reloaded">
                                <div className="content-add-movie">
                                    <label>
                                        <input
                                            placeholder="Escreva o nome do filme"
                                            type="text"
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                            className="input-search-movie"
                                        />
                                    </label>
                                </div>
                                <div className="content-add-movie">
                                    <button className="button-movie-search" type="submit">Procurar</button>
                                </div>

                            </div>
                            {movies.length > 0 ? (
                                <div className="adding-movie">
                                    <select className="select-movie" value={selectedMovie} onChange={handleMovieSelect}>
                                        <option value="">Selecione um filme</option>
                                        {movies.map((movie) => (
                                            <option key={movie.id} value={movie.id}>
                                                <div className="movie-option-title">{movie.title}</div>
                                            </option>
                                        ))}
                                    </select>

                                    {selectedMovie && (
                                        <div className="selected-movie">
                                            <img
                                                width={110}
                                                height={170}
                                                className="movie-poster"
                                                src={`https://image.tmdb.org/t/p/w185${movies.find((movie) => movie?.id === Number(selectedMovie))?.poster_path}`}
                                                alt={`Cartaz do filme ${movies.find((movie) => movie?.id === Number(selectedMovie))?.title}`}
                                            />
                                            <div className="info-movie-holt">
                                                <p id="name-movie">{movies.find((movie) => movie?.id === Number(selectedMovie))?.overview}</p>
                                                <p>Lançado em {movies.find((movie) => movie?.id === Number(selectedMovie))?.release_date.substring(0, 4)}</p>

                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : <select disabled></select>}
                        </div>
                    </div>
                    <div id="align-post-review" className="align-post-review">
                        <div className="post-review-conf">
                            <p id="alert">Você só pode publicar se escrever uma crítica e selecionar um filme</p>
                        </div>
                        <div className="post-review-conf">
                            <button id="button-handleSubmit" type="button" onClick={handleSubmit}>Publicar Crítica</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Publication;

// Colocar uma linha escrita: filme "tal" selecionado, essa linha pode ser de alguma cor clara






