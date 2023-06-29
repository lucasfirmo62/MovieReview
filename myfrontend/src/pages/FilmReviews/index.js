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
    const [publications, setPublications] = useState([])
    const [page, setPage] = useState(1)
    
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    const [numberPublications, setNumberPublications] = useState(0)

    const isFirstPageRef = useRef(false);

    let idUser = localStorage.getItem("idUser");

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=pt-BR`);
            setMovie(response.data);
        }

        fetchData()
    }, [])

    const fetchCritics = async () => {
        if (page === 1) {
          isFirstPageRef.current = true;
        }
    
        const response = await api.get(`criticas/${id}/?page=${page}`);
    
        console.log(`criticas/${id}/?page=${page}`);
    
        setNumberPublications(response.data.count);
        setPublications((prevPublications) => [
          ...prevPublications,
          ...response.data.results,
        ]);
      };
    
      const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    
        if (scrollTop + clientHeight >= scrollHeight) {
          setPage((prevPage) => prevPage + 1);
        }
      };
    
      useEffect(() => {
        if (isFirstPageRef.current === false || page !== 1) {
          fetchCritics();
        }
      }, [page]);
    
      useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
      }, []);

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
                        <h2 className="subtitle">{numberPublications <= 0 ? "Não foram encontradas críticas" : `${numberPublications} ${numberPublications === 1 ? 'crítica' : 'críticas'}`}</h2>

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
                    {publications.length > 0 && (publications.map((publication, index) => (
                        <ViewPublication
                            key={index}
                            userID={publication.user_id}
                            idPost={publication?.id}
                            idMovie={publication.movie_id}
                            rating={publication.review}
                            critic={publication.pub_text}
                            image={publication?.imgur_link}
                            date={publication.date}
                            myPub={(publication.user_id === parseInt(idUser)) ? true : false}
                            id={publication.id}
                        />
                    )))}
                </div>
                <div className="home-right-content">

                </div>
            </div>
        </>
    )
}

export default FilmReviews;