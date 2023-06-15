import React, { useState, useEffect, useRef } from "react";
import './styles.css';
import axios from 'axios';
import { FiMoreHorizontal } from 'react-icons/fi';
import { IoMdSend } from 'react-icons/io';
import { AiTwotoneLike, AiTwotoneDislike } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

import api from "../../api";

const ViewPublication = ({ userID, idPost, idMovie, rating, critic, image, date, myPub }) => {
    const [movie, setMovie] = useState([]);
    const criticRef = useRef(null);
    const criticLimitedRef = useRef(null);
    const navigate = useNavigate();
    const [user, setUser] = useState({})
    const [showComments, setShowComments] = useState({})


    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${idMovie}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=pt-BR`);
            setMovie(response.data);

            const response_user = await api.get(`usuarios/${userID}/`)
            setUser(response_user.data)
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("https://api.npoint.io/e1857903029c8c9a0f74");
            const data = await response.json();
            setShowComments(data.publications);
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
    var showPost = document.getElementById(`post-comment-${idPost}`)
    var commentPub = document.getElementById(`comment-${idPost}`)
    var commentSinglePub = document.getElementById(`single-comments-on-review-${idPost}`)
    var commentAllPub = document.getElementById(`all-comments-on-review-${idPost}`)
    var readMoreComment = document.getElementById(`read-more-comments-${idPost}`)
    var likePub = document.getElementById(`like-button-review-${idPost}`)
    var dislikePub = document.getElementById(`dislike-button-review-${idPost}`)


    if (commentAllPub) {
        commentAllPub.style.display = 'none'
    }

    if (commentSinglePub) {
        commentSinglePub.style.display = 'block'
    }

    if (readMoreComment) {
        readMoreComment.style.display = 'block'
    }


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

    if (showPost) {
        showPost.style.display = 'none'
    }

    if (commentPub) {
        commentPub.style.width = '96%';
        commentPub.style.resize = 'none'
    }

    if (likePub) {
        likePub.style.color = 'white'
    }


    if (dislikePub) {
        dislikePub.style.color = 'white'
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

    async function showCommentPost() {
        showPost.style.display = 'block'
    }

    async function cancelCommentPost() {
        showPost.style.display = 'none'
    }

    async function showAllCommentsPublication() {
        if (commentAllPub.style.display === 'none') {
            commentAllPub.style.display = 'block'
            commentSinglePub.style.display = 'none'
            readMoreComment.innerHTML = "Ver menos comentários"
        } else {
            commentAllPub.style.display = 'none'
            commentSinglePub.style.display = 'block'
            readMoreComment.innerHTML = "Ver mais comentários"
        }
    }

    async function likeButton() {
        dislikePub.style.color = 'white'

        if (likePub.style.color === 'white') {
            setTimeout(function () {
                likePub.style.color = 'rgb(243 60 151)'
            }, 300)
            var luise = -30
            for (var i = -30; i < 0; i++) {
                setTimeout(function () {
                    likePub.style.transform = `rotate(${luise + i++}deg)`;
                }, Math.abs(i) * 12);
            }
        } else {
            likePub.style.color = 'white'
        }
    }

    async function dislikeButton() {
        likePub.style.color = 'white'

        if (dislikePub.style.color === 'white') {
            setTimeout(function () {
                dislikePub.style.color = 'rgb(243 60 151)'
            }, 300)
            var luise = -30
            for (var i = -30; i < 0; i++) {
                setTimeout(function () {
                    dislikePub.style.transform = `rotate(${luise + i++}deg)`;
                }, Math.abs(i) * 12);
            }
        } else {
            dislikePub.style.color = 'white'
        }
    }

    async function handleProfileInside(profileUser) {
        navigate(`/user/${profileUser}`);

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
                <div className="zone-interactive-publication">
                    <div className="interactive-into-likes">
                        <div className="interactive-into" onClick={likeButton}><AiTwotoneLike id={`like-button-review-${idPost}`} className="like-button" /></div>
                        <div className="interactive-into" onClick={dislikeButton}><AiTwotoneDislike id={`dislike-button-review-${idPost}`} className="like-button" /></div>
                    </div>
                    <div className="interactive-into" onClick={showCommentPost}>Comentar</div>
                </div>
                <div id={`post-comment-${idPost}`} className={`post-comment-${idPost}`}>
                    <textarea id={`comment-${idPost}`} classname={`comment-${idPost}`}></textarea>
                    <div className="zone-interactive-publication-options">
                        <button className="comment-send-button" onClick={cancelCommentPost}>Cancelar</button>
                        <button className="comment-send-button-press">Postar Comentário<IoMdSend className="comment-send" /></button>
                    </div>
                </div>
                {(showComments.length > 1) ?
                    <>
                        <div id={`single-comments-on-review-${idPost}`} className={`single-comments-on-review-${idPost}`}>
                            <div className="self-comment-on">
                                <div className="content-conf-review-write">
                                    <img
                                        className="user-image"
                                        src="https://ibaseminario.com.br/novo/wp-content/uploads/2013/09/default-avatar.png"
                                        alt="user-photo"
                                    />
                                </div>
                                <div>
                                    <div className="user-insert" onClick={() => handleProfileInside(showComments[0]?.userID)}>{showComments[0]?.userName}</div>
                                    <div className="comment-view">{showComments[0]?.critic}</div>
                                </div>
                            </div>
                        </div>
                        <div id={`all-comments-on-review-${idPost}`} className={`all-comments-on-review-${idPost}`}>
                            {showComments.map((showCommentsAll) => (
                                <div className="self-comment-on">
                                    <div className="content-conf-review-write">
                                        <img
                                            className="user-image"
                                            src="https://ibaseminario.com.br/novo/wp-content/uploads/2013/09/default-avatar.png"
                                            alt="user-photo"
                                        />
                                    </div>
                                    <div>
                                        <div className="user-insert" onClick={() => handleProfileInside(showCommentsAll.userID)}>{showCommentsAll.userName}</div>
                                        <div className="comment-view">{showCommentsAll.critic}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div id={`read-more-comments-${idPost}`} className="read-more-comments" onClick={showAllCommentsPublication}>
                            Ver mais comentários
                        </div>
                    </>
                    :
                    <>
                        <div className="self-comment-on">
                            <div className="content-conf-review-write">
                                <img
                                    className="user-image"
                                    src="https://ibaseminario.com.br/novo/wp-content/uploads/2013/09/default-avatar.png"
                                    alt="user-photo"
                                />
                            </div>
                            <div>
                                <div className="user-insert" onClick={() => handleProfileInside(showComments[0]?.userID)}>{showComments[0]?.userName}</div>
                                <div className="comment-view">{showComments[0]?.critic}</div>
                            </div>
                        </div>
                    </>

                }
            </div>
        </>
    )
}

export default ViewPublication;
