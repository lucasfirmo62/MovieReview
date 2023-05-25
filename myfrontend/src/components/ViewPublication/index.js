import React, { useState, useEffect, useRef } from "react";
import './styles.css';
import axios from 'axios';
import { FiMoreHorizontal } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import api from "../../api";

const ViewPublication = ({ userID, idPost, idMovie, rating, critic, image, date, myPub }) => {
    const [movie, setMovie] = useState([]);
    const criticRef = useRef(null);
    const criticLimitedRef = useRef(null);
    const navigate = useNavigate();
    const [user, setUser] = useState({})

    let loginItem;
    if (localStorage.getItem('tokenUser')) {
        loginItem = localStorage.getItem('tokenUser').substring(1, localStorage.getItem('tokenUser').length - 1);
    }

    useEffect(() => {
        const fetchData = async () => {
            const headers = {
                Authorization: `Bearer ${loginItem}`,
                "Content-type": "application/json"
            };

            const response = await axios.get(`https://api.themoviedb.org/3/movie/${idMovie}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=pt-BR`);
            setMovie(response.data);

            const response_user = await api.get(`usuarios/${userID}/`, { headers })
            setUser(response_user.data)
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (criticRef.current) {
            var criticFormatted = critic.replace(/\n/g, "<br>");
            criticFormatted = criticFormatted.replace(/\n\n/g, "<br><br>");
            criticRef.current.innerHTML = criticFormatted;
        }
    }, [critic]);

    useEffect(() => {
        if (criticLimitedRef.current) {
            var criticFormattedLMT = critic.replace(/\n/g, "<br>");
            criticFormattedLMT = criticFormattedLMT.replace(/\n\n/g, "<br><br>");
            var criticFormattedLimited = criticFormattedLMT.substr(0, 600);
            criticLimitedRef.current.innerHTML = criticFormattedLimited;
        }
    }, [critic]);

    const currentDate = new Date();
    const providedDate = new Date(date);
    const isToday = currentDate.toDateString() === providedDate.toDateString();
    const yesterday = new Date();
    yesterday.setDate(currentDate.getDate() - 1);
    const isYesterday = yesterday.toDateString() === providedDate.toDateString();
    const isOlderThanYesterday = providedDate < yesterday;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(currentDate.getDate() - 7);
    const isOlderThanOneWeek = providedDate < oneWeekAgo;

    var datePublication;
    const time = date.substr([11])

    const hour = parseInt(time);

    const hourRt = hour - 3;

    if (isToday) {
        datePublication = `- Hoje às ${hourRt}:${time[3] + time[4]}`
    }

    if (isYesterday) {
        datePublication = `- Ontem às ${hourRt}:${time[3] + time[4]}`
    }

    if (isOlderThanYesterday) {
        const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const dayOfWeek = weekdays[providedDate.getDay()];
        datePublication = `- ${dayOfWeek} às ${hourRt}:${time[3] + time[4]}`
    }
    if (isOlderThanOneWeek) {
        const formattedDate = providedDate.toLocaleDateString();
        const formattedTime = providedDate.toLocaleTimeString();
        datePublication = `- ${formattedDate} às ${hourRt}:${time[3] + time[4]}`
    }


    var full = document.getElementById(`review-full`);
    var moreStar = document.getElementById(`star-read-more-${idPost}`);
    var imgTitleHover = document.getElementById(`img-title-hover-${idPost}`);
    var optPub = document.getElementById(`option-publication-${idPost}`)


    if (full) {
        full.style.display = 'block'
    }

    if (moreStar) {
        moreStar.style.display = 'none'
    }

    if (imgTitleHover) {
        imgTitleHover.style.position = 'absolute'
        imgTitleHover.style.width = '130px'
        imgTitleHover.style.display = 'none'
        imgTitleHover.style.marginLeft = '46px'
        imgTitleHover.style.marginTop = '-10px'
        imgTitleHover.style.borderColor = '#ff0381b5'
        imgTitleHover.style.borderWidth = '4px';
        imgTitleHover.style.borderStyle = 'solid';
        imgTitleHover.style.borderRadius = '8px';
    }

    if (optPub) {
        if (window.innerWidth < 660) {
            optPub.style.position = 'absolute'
            optPub.style.marginLeft = '80%'
            optPub.style.marginTop = '30px'
            optPub.style.backgroundColor = '#494949'
            optPub.style.borderRadius = '8px'
            optPub.style.padding = '5px'
            optPub.style.display = 'none'
        } else {
            optPub.style.position = 'absolute'
            optPub.style.marginLeft = '43%'
            optPub.style.marginTop = '30px'
            optPub.style.backgroundColor = '#494949'
            optPub.style.borderRadius = '8px'
            optPub.style.padding = '5px'
            optPub.style.display = 'none'
        }
    }

    function handleMouseEnter(idPost) {
        var imgHover = document.getElementById(`img-title-hover-${idPost}`);

        imgHover.src = `https://image.tmdb.org/t/p/w185${movie?.poster_path}`
        imgHover.style.display = 'block';

    }

    function handleMouseLeave(idPost) {
        var imgHover = document.getElementById(`img-title-hover-${idPost}`);
        imgHover.style.display = 'none';
    }

    async function openOption() {
        if (optPub.style.display === 'block') {
            optPub.style.display = 'none'
        } else {
            optPub.style.display = 'block'
        }
    }

    async function handleTitle() {
        navigate(`/movie/${idMovie}`);
    }

    async function handleProfile() {
        navigate(`/user/${userID}`);
    }

    async function editPub() {
        optPub.style.display = 'none'
    }

    async function deletPub() {
        optPub.style.display = 'none'
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
                    </div>
                    <div>
                        <div className="user-indice">De <div className="user-insert" onClick={handleProfile}>{user.nickname}</div><div className="date-release">{datePublication}</div></div>
                        <div className="movie-indice">Sobre <div className="movie-insert" onClick={handleTitle}
                            onMouseEnter={() => handleMouseEnter(idPost)} onMouseLeave={() => handleMouseLeave(idPost)}>
                            {movie?.title} de {(movie?.release_date) ? movie?.release_date.substr(0, 4) : movie?.release_date}
                        </div>
                        </div>
                        <img id={`img-title-hover-${idPost}`} className={`img-title-hover-${idPost}`} />
                        <div id={`review-full`} className={`review-full`} ref={criticRef}></div>
                        <div className="rating-content">
                            <div className="star-critic">
                                <div className="pub-star">{"★".repeat(rating)}</div>
                                <div className="no-star">{"★".repeat((5 - rating))}</div>
                            </div>
                            <div className="rating-text">{`Avaliação ${rating} de 5`}</div>
                        </div>
                        <img id="image-review" className="image-review" src={image} />
                    </div>
                    {(myPub === true) ?
                        <>
                            <FiMoreHorizontal className="del-publication" onClick={openOption} />
                            <div id={`option-publication-${idPost}`} className={`option-publication-${idPost}`}>
                                <div className="options-publication-inside" onClick={editPub}>Editar</div>
                                <div className="options-publication-inside" onClick={deletPub}>Excluir</div>
                            </div>
                        </>
                        :
                        null
                    }
                </div>
            </div>
        </>
    )
}

export default ViewPublication;
