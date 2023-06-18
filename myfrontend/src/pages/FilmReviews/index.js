import React, { useState, useEffect, useRef } from "react";
import './styles.css';

import Header from "../../components/header";
import HeaderDesktop from "../../components/headerDesktop";

import Menu from "../../components/menu";

import api from "../../api";

import ViewPublication from "../../components/ViewPublication";

import { useParams, Link } from 'react-router-dom';

import axios from "axios";

import { MdArrowBack } from "react-icons/md";

const FilmReviews = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null)
    const [numberPublications, setNumberPublications] = useState(0)

    const isFirstPageRef = useRef(false);

    const [page, setPage] = useState(1)

    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    let loginItem;

    let idUser = localStorage.getItem("idUser");

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=pt-BR`);
            setMovie(response.data);
        }

        fetchData()
    }, [])

    return (
        <>
            {(window.innerWidth > 760) ?
                <HeaderDesktop />
                :

                <Header />
            }
            <div className="content-home">
                {windowSize.width < 680
                    ?
                    (
                        <Menu />
                    )
                    :
                    <div className="home-left-content">
                        <Menu />
                    </div>
                }
                <div className="content-box-home">
                    <div className="movie-critic-info">

                        <Link
                            className="review-back-btn"
                            to={`/movie/${id}`}
                            style={{ textDecoration: "none", color: "#8d8d8d" }}
                        >
                            <MdArrowBack size={32} className="back-icon" />
                        </Link>

                        <h1 className="title">{movie?.title}</h1>
                        <h2 className="subtitle">2 críticas</h2>

                        <div
                            className="movie-details-container"
                            style={{
                                backgroundImage: `url(${movie?.backdrop_path ? `https://image.tmdb.org/t/p/original/${movie.backdrop_path}` : ''})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                width: '100%',
                                height: '210px'
                            }}
                        ></div>
                    </div>
                    <ViewPublication
                        userID={1} 
                        idPost={1} 
                        idMovie={502356} 
                        rating={4}
                        critic="Ótimo filme! Altamente recomendado." 
                        image={null} 
                        date="2023-06-08T15:30:00Z" 
                        myPub={false}
                    />
                    <ViewPublication
                        userID={1} 
                        idPost={3} 
                        idMovie={502356} 
                        rating={4}
                        critic="Ótimo filme! Altamente recomendado." 
                        image={null} 
                        date="2023-06-08T15:30:00Z" 
                        myPub={false}
                    />
                </div>
                <div className="home-right-content">

                </div>
            </div>
        </>
    )
}

export default FilmReviews;