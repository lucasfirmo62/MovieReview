import React, { useEffect, useState } from "react";
import Header from '../../components/header';
import Menu from '../../components/menu';

import styles from './styles.css';

import api from "../../api";

import { Link } from "react-router-dom";

import { MdArrowBack } from "react-icons/md";

import Pagination from "../../components/pagination";

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        async function getMovies() {
            let id = localStorage.getItem('idUser')
            let token = localStorage.getItem('tokenUser')

            id = id.substring(1, id.length - 1)
            token = token.substring(1, token.length - 1)

            const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

            const response = await api.get(`/watchlist/`, { headers })

            await setWatchlist(response.data)
        }
        getMovies()
    }, [])

    function handlePageChange(event, pageNumber) {
        event.preventDefault();
        setCurrentPage(pageNumber);
    }

    return (
        <>
            <Header />
            <div className="content-page">

                <div className="left-content">
                    <Menu />
                </div>

                <div className="center-content">
                    <div className="watchlist-content">
                        <div className="title-content">
                            <Link
                                className="back-btn"
                                to={`/profile/`}
                                style={{ textDecoration: "none", color: "#fff" }}
                            >
                                <MdArrowBack size={32} className="back-icon" />
                            </Link>
                            <h1 className="title-component">Filmes para assistir</h1>
                        </div>
                    </div>

                    {watchlist.map((movie, index) => (
                        <div key={index} className="watchlist-list">
                            <img className="watchlist-movie-img" src={movie.poster_img} />
                            <Link
                                className="movie-favorite-item"
                                to={`/movie/${movie.movie_id}`}
                            >
                                <p className="movieTitle">{movie.movie_title}</p>
                            </Link>
                        </div>
                    ))}

                    {watchlist.length > 0 && (
                        <Pagination
                            totalPages={totalPages > 5 ? 5 : totalPages}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export default Watchlist;