import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

import { useParams } from 'react-router-dom';

import axios from 'axios';

import Header from '../../components/header';
import HeaderDesktop from "../../components/headerDesktop";

import posternotfound from '../../assets/posternotfound.png'
import userDefault from '../../assets/user-default.jpg'

import { BsFillPlayFill } from 'react-icons/bs';
import { AiFillCloseCircle } from 'react-icons/ai';
import { FaStar } from 'react-icons/fa';

import api from '../../api';

const Movie = () => {
    const { id } = useParams();

    const [movie, setMovie] = useState({});
    const [director, setDirector] = useState('');
    const [cast, setCast] = useState([]);
    const [streamingProviders, setStreamingProviders] = useState([]);
    const [showTooltip, setShowTooltip] = useState(false);
    const [trailer, setTrailer] = useState([]);
    const [trailerUS, setTrailerUS] = useState([]);
    const [isMovieFavorite, setIsMovieFavorite] = useState(false);

    const castRef = useRef(null);

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=pt-BR`);
            setMovie(response.data);

            const creditsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}`);
            const crew = creditsResponse.data.crew;
            const director = crew.find(member => member.job === 'Director');

            setDirector(director ? director.name : '');

            const providersResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${process.env.REACT_APP_TMDB_API_KEY}`);
            const brProviders = providersResponse.data.results.BR;
            setStreamingProviders(brProviders?.flatrate || []);

            const castResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}`);
            setCast(castResponse.data.cast);

            const videoTrailer = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=pt-BR`);
            setTrailer(videoTrailer.data);

            const videoTrailerUS = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`);
            setTrailerUS(videoTrailerUS.data);
        }
        fetchData();
    }, [id]);

    setTimeout(function () {
        const buttonTrailer = document.getElementById("button-trailer");
        const backButtonTrailer = document.getElementById("back-button-trailer");
      
        if (buttonTrailer && backButtonTrailer) {
          if (!(trailer?.results)) {
            buttonTrailer.style.display = "none";
            backButtonTrailer.style.display = "none";
          } else {
            buttonTrailer.style.display = "block";
            backButtonTrailer.style.display = "block";
          }
        }
    }, 100);


    function trailerShow() {
        const contentVideo = document.getElementById("content-video");
        const trailerElement = document.getElementById("trailer");
      
        if (contentVideo && trailerElement) {
          contentVideo.style.display = "block";
      
          if (trailer?.results[0]) {
            trailerElement.src = `https://www.youtube.com/embed/${trailer.results[0]?.key}?=autoplay=1`;
          } else if (trailerUS?.results[0]) {
            trailerElement.src = `https://www.youtube.com/embed/${trailerUS.results[0]?.key}?=autoplay=1`;
          }
        }
      }
      
      function trailerHidden() {
        const contentVideo = document.getElementById("content-video");
        const trailerElement = document.getElementById("trailer");
      
        if (contentVideo && trailerElement) {
          contentVideo.style.display = "none";
          trailerElement.src = "https://www.youtube.com/embed/undefined";
        }
      }

    async function toggleFavoritar() {
        const data = {
            "movie_id": id,
            "poster_img": `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
            "movie_title": movie.title
        }

        try {
            await api.post('/favoritos/', data)

            setIsMovieFavorite(true)
        } catch(error) {
            console.log(error)
        }
    }

    async function toggleDesfavoritar() {
        try {
            await api.delete(`/favoritos/${id}/`)

            setIsMovieFavorite(false)
        } catch(error) {
            console.log(error)
        }
    }

    useEffect(() => {
        async function get_data() {            
            try {
                const response = await api.get(`/favoritos/${id}/is_movie_favorite/`)
                setIsMovieFavorite(response.data.is_favorite)
            } catch (error) {
                console.log(error)
            }
        }

        get_data()
    }, [])

    return (
        <>
            {(window.innerWidth > 760) ?
                <HeaderDesktop />
                :

                <Header />
            }

            <div
                className="movie-details-container"
                style={{
                    backgroundImage: `url(${movie?.backdrop_path ? `https://image.tmdb.org/t/p/original/${movie.backdrop_path}` : ''})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
            


                <div className='movie-details-content'>
                    <div>
                        <img
                            src={movie?.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : posternotfound}
                            alt={movie.title}
                        />
                        <div id='back-button-trailer' style={(window.screen.width <= 768) ? { backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`, backgroundSize: `auto`, backgroundPosition: `50% 50%` }
                            :
                            { backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`, backgroundSize: `auto`, backgroundPosition: `19% 77%` }
                        } className='watch-trailer'>
                        </div>
                        <div id='button-trailer' onClick={trailerShow} className='button-trailer'><p><BsFillPlayFill /> Assistir Trailer</p></div>
                    </div>
                    <div className="movie-details">
                        <div
                            className='title-details'
                        >
                            <h1>{movie.title ? movie.title : ''}</h1>
                            <h1>({movie.release_date ? new Date(movie.release_date).getFullYear() : ''})</h1>
                        </div>
                        {director && <p className="Diretor">Um filme de {director}</p>}
                        <p className="overview">{movie.overview}</p>
                        <ul className="streamings-content" style={{ listStyleType: 'none', margin: 0, padding: 0, display: 'flex' }}>
                            {streamingProviders && streamingProviders.map(provider => (
                                <li key={provider.provider_id}>
                                    <img style={{ width: 34, height: 34, margin: 8, borderRadius: 4 }} src={`https://image.tmdb.org/t/p/original/${provider.logo_path}`} alt={provider.provider_name} />
                                </li>
                            ))}
                        </ul>
                        {isMovieFavorite ? 
                            (<button id="favoritar-button" className="favoritar-button" onClick={toggleDesfavoritar}>Desfavoritar</button>)
                            :
                            (<button id="favoritar-button" className="favoritar-button" onClick={toggleFavoritar}>Favoritar</button>)
                        }
                    </div>
                    <h2 className="cast-block">Elenco</h2>
                    <ul ref={castRef} className="cast-content" style={{ width: 'max-content', listStyleType: 'none', margin: 0, paddingLeft: '16px' }}>
                        {cast && cast.map(member => (
                            <li className="cast-item" key={member.id} style={{ width: 'max-content' }}>
                                <img
                                    onMouseEnter={() => setShowTooltip(true)}
                                    onMouseLeave={() => setShowTooltip(false)}
                                    style={{ width: 100, height: 150, borderRadius: 4, position: 'relative' }}
                                    src={member?.profile_path ? `https://image.tmdb.org/t/p/w500/${member?.profile_path}` : userDefault}
                                    alt={member?.name}
                                    title={member?.name}
                                />

                                <p className="movie-name">{member.name}</p>

                                {showTooltip && (
                                    <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'black', color: 'white', padding: '8px', borderRadius: '4px' }}>
                                        {member.name}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div id='content-video' className='content-video'>
                <iframe id="trailer" className='video-trailer' src={`https://www.youtube.com/embed/undefined`} allow='autoplay' />
                <AiFillCloseCircle onClick={trailerHidden} className='close-trailer-button' />
            </div>
        </>
    );
};

export default Movie;