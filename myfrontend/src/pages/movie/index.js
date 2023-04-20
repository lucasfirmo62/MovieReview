import React, { useState, useEffect } from 'react';
import './styles.css';

import { useParams } from 'react-router-dom';

import axios from 'axios';

import Header from '../../components/header';

import posternotfound from '../../assets/posternotfound.png'

const Movie = () => {
    const { id } = useParams();
    
    const [movie, setMovie] = useState({});
    const [director, setDirector] = useState('');
    const [streamingProviders, setStreamingProviders] = useState([]);

    useEffect(() => {
        async function fetchMovie() {
          const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=pt-BR`);
          setMovie(response.data);
    
          const creditsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}`);
          const crew = creditsResponse.data.crew;
          const director = crew.find(member => member.job === 'Director');
    
          setDirector(director ? director.name : '');
    
          const providersResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${process.env.REACT_APP_TMDB_API_KEY}`);
          const brProviders = providersResponse.data.results.BR;
          setStreamingProviders(brProviders?.flatrate || []);
        }
        fetchMovie();
      }, [id]);    

    return (
        <>
            <Header />

            <div
                className="movie-details-container"
                style={{ backgroundImage: `url(${movie?.backdrop_path ? `https://image.tmdb.org/t/p/original/${movie.backdrop_path}` : ''})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className='movie-details-content'>

                    <img
                        src={movie?.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : posternotfound}
                        alt={movie.title}
                    />
                    <div className="movie-details">
                        <div 
                            className='title-details'                       
                        >
                            <h1>{movie.title ? movie.title : ''}</h1>
                            <h1>({new Date(movie.release_date).getFullYear()})</h1>
                        </div>


                        {director && <p className="Diretor">Um filme de {director}</p>}

                        <p className="overview">{movie.overview}</p>

                        <ul className="streamings-content" style={{ listStyleType: 'none', margin: 0, padding: 0, display: 'flex' }}>
                            {streamingProviders && streamingProviders.map(provider => (
                                <li key={provider.provider_id}>
                                    <img style={{width: 34, height: 34, margin: 8, borderRadius: 4}} src={`https://image.tmdb.org/t/p/original/${provider.logo_path}`} alt={provider.provider_name} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Movie;