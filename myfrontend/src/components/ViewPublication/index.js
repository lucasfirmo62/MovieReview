import React, { useState, useEffect, useRef } from "react";
import './styles.css';
import axios from 'axios';
import { MdArrowForwardIos } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';


const ViewPublication = ({ userName, userID, idPost, idMovie, rating, critic, image, date }) => {
    const [movie, setMovie] = useState([]);
    const criticRef = useRef(null);
    const criticLimitedRef = useRef(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${idMovie}?api_key=93296066cafd1a70fac5ed2532fda74f&language=pt-BR`);
            setMovie(response.data);
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

    if (isToday) {
        datePublication = `- Hoje às ${time[0] + time[1]}:${time[3] + time[4]}`
    }

    if (isYesterday) {
        datePublication = `- Ontem às ${time[0] + time[1]}:${time[3] + time[4]}`
    }

    if (isOlderThanYesterday) {
        const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const dayOfWeek = weekdays[providedDate.getDay()];
        datePublication = `- ${dayOfWeek} às ${time[0] + time[1]}:${time[3] + time[4]}`
        console.log(dayOfWeek);
    }
    if (isOlderThanOneWeek) {
        const formattedDate = providedDate.toLocaleDateString();
        const formattedTime = providedDate.toLocaleTimeString();
        datePublication = `- ${formattedDate} às ${time[0] + time[1]}:${time[3] + time[4]}`
    }


    var preview = document.getElementById(`${idPost}-preview`);
    var full = document.getElementById(`${idPost}-full`);
    var moreStar = document.getElementById(`star-read-more-${idPost}`);
    var imgTitleHover = document.getElementById(`img-title-hover-${idPost}`);


    if (preview && full) {
        preview.style.display = 'block'
        full.style.display = 'none'
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

    async function reviewAll() {
        preview.style.display = 'none'
        full.style.display = 'block'

        var more = document.getElementById(`${idPost}-more`);
        more.style.display = 'none'

        moreStar.style.display = 'block'
    }

    function handleMouseEnter(idPost) {
        var imgHover = document.getElementById(`img-title-hover-${idPost}`);
        imgHover.style.display = 'block';
    }

    function handleMouseLeave(idPost) {
        var imgHover = document.getElementById(`img-title-hover-${idPost}`);
        imgHover.style.display = 'none';
    }


    async function handleTitle(){
        navigate(`/movie/${idMovie}`);
    }

    async function handleProfile(){
        navigate(`/user/${userID}`);
    }

    const widthInside = window.innerWidth;

    if(preview && full){
        if(widthInside <= 680){
            preview.style.marginLeft = "-65px"
            full.style.marginLeft = "-65px"
        }
        else if(widthInside >= 680){
            preview.style.marginLeft = "0px"
            full.style.marginLeft = "0px"
        }

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
                        <div className="user-indice">De <div className="user-insert" onClick={handleProfile}>{userName}</div><div className="date-release">{datePublication}</div></div>
                        <div className="movie-indice">Sobre <div className="movie-insert" onClick={handleTitle}
                            onMouseEnter={() => handleMouseEnter(idPost)} onMouseLeave={() => handleMouseLeave(idPost)}>
                            {movie?.title} de {(movie?.release_date) ? movie?.release_date.substr(0, 4) : movie?.release_date}
                        </div>
                        </div>
                        <img id={`img-title-hover-${idPost}`} className={`img-title-hover-${idPost}`} src={`https://image.tmdb.org/t/p/w185${movie?.poster_path}`} />
                        <div id={`${idPost}-preview`} className={`${idPost}-preview`} ref={(criticRef.length >= 600) ? criticRef : criticLimitedRef}></div>
                        <div id={`${idPost}-full`} className={`${idPost}-full`} ref={criticRef}></div>
                        <div></div>
                        {(critic.length >= 600) ?
                            <div id={`${idPost}-more`} className="read-more" onClick={reviewAll}>Ler crítica completa<MdArrowForwardIos className="arrow-display" /></div>
                            :
                            null
                        }
                        {(critic.length >= 600) ?
                            <div id={`star-read-more-${idPost}`} className={`star-read-more-${idPost}`}>
                                <div className="rating-content">
                                    <div className="star-critic">
                                        <div className="star">{"★".repeat(rating)}</div>
                                        <div className="no-star">{"★".repeat((5 - rating))}</div>
                                    </div>
                                    <div className="rating-text">{`Avaliação ${rating} de 5`}</div>
                                </div>
                            </div>
                            :
                            <div className="rating-content">
                                <div className="star-critic">
                                    <div className="star">{"★".repeat(rating)}</div>
                                    <div className="no-star">{"★".repeat((5 - rating))}</div>
                                </div>
                                <div className="rating-text">{`Avaliação ${rating} de 5`}</div>
                            </div>
                        }
                        <img id="image-review" className="image-review" src={image} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewPublication;
