import React, { useState, useEffect } from "react";
import './styles.css';
import { AiFillPlusCircle } from 'react-icons/ai';

import axios from "axios";
import api from '../../api';

import ImageUpload from "../ImageUpload";

const REVIEWS = [
    { id: 1, value: '1 - Horrível' },
    { id: 2, value: '2 - Ruim' },
    { id: 3, value: '3 - Mediano' },
    { id: 4, value: '4 - Bom' },
    { id: 5, value: '5 - Excelente' }
];

const Publication = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState({});
    const [postText, setPostText] = useState('');
    const [selectedReview, setSelectedReview] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [minLoadingTimePassed, setMinLoadingTimePassed] = useState(false);

    useEffect(() => {
        const minLoadingTime = 1100;
        const timer = setTimeout(() => {
            setMinLoadingTimePassed(true);
        }, minLoadingTime);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    function handleReviewChange(event) {
        setSelectedReview(event.target.value);
    }

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

    const handleMovieSelect = (event) => {
        setSelectedMovie(event.target.value);
        document.getElementById("align-post-review").style.display = "block"
        document.getElementById("button-handleSubmit").style.display = "block"

        document.getElementById("review").style.display = "block"
    };

    async function addMovie() {
        document.getElementById("publication-movie-content").style.display = "flex"
        document.getElementById("publication-movie-content").style.flexDirection = "column"
        document.getElementById("publication-movie-content").style.alignItems = "center"
        document.getElementById("publication-movie-content").style.justifyItems = "center"
        document.getElementById("button-add-movie").style.display = "none"
    }

    async function handleSubmit(event) {
        event.preventDefault()

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
            return
        }

        let id = localStorage.getItem("idUser")
        id = id.substring(1, id.length - 1)
        let token = localStorage.getItem("tokenUser")
        token = token.substring(1, token.length - 1)

        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString();

        const data = {
            "review": selectedReview,
            "pub_text": postText,
            "user_id": parseInt(id),
            "date": formattedDate,
            "movie_id": selectedMovie.id,
            "movie_title": selectedMovie.original_title,
        }

        const formData = new FormData();

        setIsLoading(true);
        setMinLoadingTimePassed(false);

        formData.append('image', selectedFile);
        formData.append('review', data.review);
        formData.append('pub_text', data.pub_text);
        formData.append('user_id', data.user_id);
        formData.append('date', data.date);
        formData.append('movie_id', data.movie_id);
        formData.append('movie_title', data.movie_title);

        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' };

        api.post('/publicacoes/', formData, { headers })
            .then(response => {
                console.log(response.data);
                window.location.reload()
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
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

    function handleMoviesSelect(event) {
        const selectedMovie = event.target.value;
        if (selectedMovie === "" || selectedMovie === '{"title":""}') {
            setSelectedMovie(null);
        } else {
            setSelectedMovie(JSON.parse(selectedMovie));
        }
    }

    function handle(event) {
        handleMovieSelect(event)
        handleMoviesSelect(event)
    }

    return (
        <>
            <div className="publication-content">
                {(isLoading || !minLoadingTimePassed) && (
                    <div className="loading-overlay">
                        <div className="loading-indicator"></div>
                    </div>
                )}
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
                    />
                </div>

                <button
                    onClick={addMovieAndSeeBest}
                    id="button-add-movie"
                    className="button-add-movie"><AiFillPlusCircle className="plus-icon" />Adicionar filme</button>
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
                                    <select className="select-movie" value={JSON.stringify(selectedMovie)} onChange={handle}>
                                        <option value="">Selecione um filme</option>
                                        {movies.map((movie) => (
                                            <option className="movie-option-title" key={movie.id} value={JSON.stringify(movie)}>
                                                {movie.title}
                                            </option>
                                        ))}
                                    </select>
                                    {selectedMovie && (
                                        <div className="selected-movie">
                                            <img
                                                width={110}
                                                height={170}
                                                className="movie-poster"
                                                src={`https://image.tmdb.org/t/p/w185${movies.find((movie) => movie?.id === Number(selectedMovie.id))?.poster_path}`}
                                                alt={`Cartaz do filme ${movies.find((movie) => movie?.id === Number(selectedMovie.id))?.title}`}
                                            />
                                            <div className="info-movie-holt">
                                                <p id="name-movie">{movies.find((movie) => movie?.id === Number(selectedMovie.id))?.overview}</p>
                                                <p>Lançado em {movies.find((movie) => movie?.id === Number(selectedMovie.id))?.release_date.substring(0, 4)}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : <select disabled></select>}
                        </div>
                    </div>
                    <div id="align-post-review" className="align-post-review">
                        <ImageUpload selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
                        <div className="post-review-conf">
                            <p id="alert">Você só pode publicar se escrever uma crítica e selecionar um filme</p>
                        </div>
                        <div className="post-review-conf">
                            <select id="review" value={selectedReview} onChange={handleReviewChange}>
                                <option value="">Selecione uma nota</option>
                                {REVIEWS.map(review => (
                                    <option key={review.id} value={review.id}>{review.value}</option>
                                ))}
                            </select>
                            <button id="button-handleSubmit" type="button" onClick={handleSubmit}>Publicar Crítica</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Publication;






