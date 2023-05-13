import React, { useState, useEffect } from "react";
import './styles.css';
import { AiFillPlusCircle } from 'react-icons/ai';
import { FaSpinner } from 'react-icons/fa';

import axios from "axios";
import api from '../../api';

import ImageUpload from "../ImageUpload";
import { FaCheck } from 'react-icons/fa';

import StarRating from "../StarRating";

import { debounce } from 'lodash';

const Publication = () => {

    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState('');
    const [postText, setPostText] = useState('');
    const [selectedReview, setSelectedReview] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [minLoadingTimePassed, setMinLoadingTimePassed] = useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showMovieOptions, setShowMovieOptions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    function handleReviewChange(rating) {
        setSelectedReview(rating);
    }

    const debouncedSearch = debounce(async (query) => {
        try {
            const url = 'https://api.themoviedb.org/3/search/movie'

            const response = await axios.get(url, {
                params: {
                    api_key: process.env.REACT_APP_TMDB_API_KEY,
                    query,
                    language: 'pt-BR',
                },
            });

            setMovies(response.data.results);

        } catch (error) {
            console.error(error);
        } finally {
            setIsSearching(false);
        }
    }, 4000);

    const handleSearchChange = (event) => {
        setIsSearching(true);
        debouncedSearch(event.target.value)
        setShowMovieOptions(true);
    };

    const handleMovieSelect = (event) => {
        document.getElementById("align-post-review").style.display = "block"
        document.getElementById("button-handleSubmit").style.display = "block"
        document.getElementById("review").style.display = "block"
    };

    async function addMovie() {
        document.getElementById("publication-movie-content").style.display = "flex"
        document.getElementById("publication-movie-content").style.flexDirection = "column"
        document.getElementById("publication-movie-content").style.alignItems = "center"
        document.getElementById("button-add-movie").style.display = "none"
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        let errorMsg = '';

        if ((document.getElementById("review-text").value).length < 10) {
            errorMsg += "A crítica precisa ter mais de 10 caracteres. ";
        }

        if (selectedMovie === '') {
            errorMsg += "O filme precisa ser selecionado. ";
        }

        if (selectedReview === '') {
            errorMsg += "A nota precisa ser selecionada. ";
        }

        if (errorMsg !== '') {
            alert(errorMsg);
            return;
        }

        let id = localStorage.getItem("idUser");
        id = id.substring(1, id.length - 1);
        let token = localStorage.getItem("tokenUser");
        token = token.substring(1, token.length - 1);

        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString();

        const data = {
            "review": selectedReview,
            "pub_text": postText,
            "user_id": parseInt(id),
            "date": formattedDate,
            "movie_id": selectedMovie.id,
            "movie_title": selectedMovie.original_title,
        };

        const formData = new FormData();

        setIsLoading(true);

        formData.append('image', selectedFile);
        formData.append('review', data.review);
        formData.append('pub_text', data.pub_text);
        formData.append('user_id', data.user_id);
        formData.append('date', data.date);
        formData.append('movie_id', data.movie_id);
        formData.append('movie_title', data.movie_title);

        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' };

        try {
            const response = await api.post('/publicacoes/', formData, { headers });
            console.log(response.data);

            setMinLoadingTimePassed(false);

            await delay(2000);

            setMinLoadingTimePassed(true);

            setIsLoading(false);
            setShowConfirmation(true);

            await delay(2000);

            setShowConfirmation(false);
        } catch (error) {
            console.log(error);
        } finally {
        }
        window.location.reload();
    };

    async function seeBest() {
        document.getElementById("button-cancel").style.display = "block"
    }

    async function cancelPost() {
        setSelectedFile(null);
        setSelectedMovie('')
        setSelectedReview('')
        setMovies([])

        document.getElementById("review-text").style.height = "20px"
        document.getElementById("review-text").value = ""

        document.getElementById("button-cancel").style.display = "none"
        document.getElementById("publication-movie-content").style.display = "none"
        document.getElementById("align-post-review").style.display = "none"
        document.getElementById("button-handleSubmit").style.display = "none"
        document.getElementById("review").style.display = "none"
        document.getElementsByClassName("input-search-movie").value = ""
        document.getElementById("button-add-movie").style.display = "block"
    }

    function addMovieAndSeeBest() {
        addMovie();
        seeBest();
    }

    function handle(event, movie) {
        setSelectedMovie(movie);

        handleMovieSelect(event)

        setShowMovieOptions(false);
    }

    return (
        <>
            <div className="publication-content">

                {(isLoading || !minLoadingTimePassed) ? (
                    <div className="loading-overlay">
                        <div className="loading-indicator"></div>
                    </div>
                ) : showConfirmation ? (
                    <div className="confirmation-overlay">
                        <div className="confirmation-icon">
                            <FaCheck size={32} color="green" />
                        </div>
                    </div>
                ) : null}

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
                        placeholder="Escrever uma Crítica"
                        id="review-text"
                    />
                </div>

                <button
                    onClick={addMovieAndSeeBest}
                    id="button-add-movie"
                    className="button-add-movie"
                >
                    <AiFillPlusCircle className="plus-icon" />
                    Adicionar Crítica
                </button>
                <br />

                <div className="content-post-review">
                    <div id="publication-movie-content" className="publication-movie-content">

                        <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", justifyContent: "center"}}>
                            <input
                                type="text"
                                placeholder="Selecione o filme"
                                onChange={handleSearchChange}
                                className={Object.keys(selectedMovie).length === 0 ? "input-search-movie" : "input-search-movie input-search-movie-selected"}
                                list="movie-options"
                            />
                            {isSearching && <FaSpinner className="loading-icon" />}
                        </div>
                        {showMovieOptions && (
                            <div className="movie-options-wrapper">
                                <div className="movie-options">
                                    {movies.map((movie) => (
                                        <div
                                            key={movie.id}
                                            className="movie-option"
                                            onClick={(event) => handle(event, movie)}
                                        >
                                            {movie.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedMovie ? (
                            <div style={{ width: "100%" }} className="adding-movie">
                                <div className="selected-movie">
                                    <img
                                        width={80}
                                        height={120}
                                        className="movie-poster"
                                        src={`https://image.tmdb.org/t/p/w185${selectedMovie?.poster_path}`}
                                        alt={`Cartaz do filme ${selectedMovie?.title}`}
                                    />

                                    <div className="info-movie-holt">
                                        <p id="name-movie">{selectedMovie?.title}</p>
                                        <p>Lançado em {selectedMovie?.release_date.substring(0, 4)}</p>
                                    </div>
                                </div>
                            </div>
                        ) : true}
                    </div>
                </div>

                <div
                    id="align-post-review"
                    className="align-post-review"
                >
                    <ImageUpload
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                    />

                    <div className="post-review-conf">
                        <StarRating
                            selectedRating={selectedReview}
                            onChange={handleReviewChange}
                        />
                        <button
                            style={{ maxWidth: "140px" }}
                            id="button-handleSubmit"
                            type="button"
                            onClick={handleSubmit}
                        >
                            Publicar Crítica
                        </button>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Publication;