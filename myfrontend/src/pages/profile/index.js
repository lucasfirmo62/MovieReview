import React, { useState, useEffect, useRef } from "react";
import './styles.css'
import Menu from '../../components/menu'
import api from "../../api";
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header'
import HeaderDesktop from "../../components/headerDesktop";
import SuperCritico from '../../components/SuperCritico'
import ViewPublication from "../../components/ViewPublication";
import axios from 'axios';
import CardFollower from "../../components/CardFollower";

import { MdArrowBack } from 'react-icons/md';

import { Link } from "react-router-dom";


const Profile = () => {

    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(1);
    const [user, setUser] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const isFirstPageRef = useRef(false);

    var loginItem;
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])

    const navigate = useNavigate();

    if (localStorage.getItem('tokenUser')) {
        loginItem = localStorage.getItem('tokenUser').substring(1, localStorage.getItem('tokenUser').length - 1);
    }

    var idUser = localStorage.getItem('idUser');

    useEffect(() => {
        async function userUtility() {
            const headers = {
                Authorization: `Bearer ${loginItem}`,
                "Content-type": "application/json"
            };

            await api.get(`/usuarios/${idUser}/`, { headers })
                .then(response => { setUser(response.data) })
            
            const followersResponse = await api.get(`/usuarios/followers/`, {
                    headers,
            });

            const followingResponse = await api.get(`/usuarios/following/`, {
                headers,
            });
          
            setFollowers(followersResponse.data);
            setFollowing(followingResponse.data);
        }

        userUtility()
    }, [idUser, loginItem])

    async function goEditProfile() {
        navigate("/edit-profile")
    }


    const fetchProfilePost = async () => {
        if (page === 1) {
            isFirstPageRef.current = true;
        }

        const headers = {
            Authorization: `Bearer ${loginItem}`,
            "Content-type": "application/json"
        };

        const response = await api.get(`pubusuario/${idUser}/?page=${page}`, { headers });
        setPublications(prevPublications => [...prevPublications, ...response.data.results]);
    };

    useEffect(() => {
        if (isFirstPageRef.current === false || page !== 1) {
            fetchProfilePost();
        }
    }, [page]);

    const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 0) {
            setPage(page + 1);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    return (
        <>
            {(window.innerWidth > 760) ?
                <HeaderDesktop />
                :

                <Header />
            }
            <div className="content-all">

                {windowSize.width < 680
                    ?
                    (
                        <Menu />
                    )
                    :
                    <div className="left-content">
                        <Menu />
                    </div>}
                <div className="content-box-profile">
                    <div className="profile-info">
                        <img className="image-user" alt="user" src="https://i.imgur.com/piVx6dg.png" />
                        <div>
                            <p className="name-user">{user.full_name}</p>
                            <p className="username-text">@{user.nickname}</p>
                            {user.super_reviewer ? <SuperCritico /> : null}
                            <p className="bio-text">{user.bio_text}</p>
                            <p className="edit-profile" onClick={goEditProfile}>Editar Perfil</p>
                        </div>
                    </div>

                    <div className={'tabs-profile'}>
                        <Link
                            to={{
                                pathname: `/followers/${idUser}`,
                            }}
                            state={{
                                prevPath: '/profile'
                            }}
                            style={{ textDecoration: "none", color: "#fff" }}
                        >
                            <p className={'tab-profile'}>{followers.length} Seguidores</p>
                        </Link>
                        <Link
                            to={{
                                pathname: `/following/${idUser}`,
                            }}
                            state={{
                                prevPath: '/profile'
                            }}
                            style={{ textDecoration: "none", color: "#fff" }}
                        >
                            <p className={'tab-profile'}>{following.length} Seguindo</p>
                        </Link>
                        <Link
                            to={`/favoritos`}
                            style={{ textDecoration: "none", color: "#fff" }}
                        >
                            <p className={'tab-profile'}>Favoritos</p>
                        </Link>
                    </div>
                    {publications.map((publication) => (
                        <ViewPublication
                            userID={publication.user_id}
                            idPost={publication?.date?.slice(20) + publication?.movie_id}
                            idMovie={publication.movie_id}
                            rating={publication.review}
                            critic={publication.pub_text}
                            image={publication?.imgur_link}
                            date={publication.date}
                            myPub={(publication.user_id === parseInt(idUser)) ? true : false}
                        />
                    ))}
                </div>
                <div className="right-content">

                </div>
            </div>
        </>
    )
}

export default Profile;
