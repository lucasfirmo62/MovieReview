import React, { useState, useEffect, useRef } from "react";
import './styles.css';

import Header from "../../components/header";
import HeaderDesktop from "../../components/headerDesktop";

import Menu from "../../components/menu";

import api from "../../api";

import ViewPublication from "../../components/ViewPublication";

import { useParams } from 'react-router-dom';

import axios from "axios";

const Critics = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null)
    const isFirstPageRef = useRef(false);

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=pt-BR`);
            setMovie(response.data);
        }

        fetchData()
    })

    const [publications, setPublications] = useState([])
    const [page, setPage] = useState(1)
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    let loginItem;

    if (localStorage.getItem('tokenUser')) {
        loginItem = localStorage.getItem('tokenUser').substring(1, localStorage.getItem('tokenUser').length - 1);
    }

    let idUser = localStorage.getItem("idUser");

    const fetchCritics = async () => {
        if (page === 1) {
            isFirstPageRef.current = true;
        }

        const headers = {
            Authorization: `Bearer ${loginItem}`,
            "Content-type": "application/json"
        };

        const response = await api.get(`criticas/${id}/?page=${page}`, { headers });
        setPublications(prevPublications => [...prevPublications, ...response.data.results]);
    };

    useEffect(() => {
        if (isFirstPageRef.current === false || page !== 1) {
            fetchCritics();
        }
    }, [page]);

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
                        <h1 className="title">Críticas para {movie?.title}</h1>
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
                    {publications.map((publication) => (
                        <ViewPublication
                            userID={publication.user_id}
                            idPost={publication?.id}
                            idMovie={publication.movie_id}
                            rating={publication.review}
                            critic={publication.pub_text}
                            image={publication?.imgur_link}
                            date={publication.date}
                            myPub={(publication.user_id === parseInt(idUser)) ? true : false}
                        />
                    ))}
                </div>
                <div className="home-right-content">

                </div>
            </div>
        </>
    )
}

export default Critics;