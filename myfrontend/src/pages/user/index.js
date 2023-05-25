import React, { useState, useEffect, useRef } from "react";
import './styles.css'
import api from "../../api";
import Menu from '../../components/menu'
import Header from '../../components/header'
import { useNavigate } from 'react-router-dom';
import SuperCritico from '../../components/SuperCritico'
import FollowUnfollow from "../../components/Follow-Unfollow";

import ViewPublication from "../../components/ViewPublication";

import { Link, useLocation } from "react-router-dom";

const User = () => {
    const location = useLocation();

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

    const url = window.location.href;
    const id = url.split('user/')[1];

    const [user, setUser] = useState([]);
    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [publications, setPublications] = useState([]);
    const [myfollowing, setMyFollowing] = useState([]);
    const [myfollowers, setMyFollowers] = useState([]);
    const [isFollowingLoaded, setIsFollowingLoaded] = useState(false);
    
    const [page, setPage] = useState(1);
    const isFirstPageRef = useRef(false);

    const navigate = useNavigate();

    var loginItem;

    if (localStorage.getItem('tokenUser')) {
        loginItem = localStorage.getItem('tokenUser').substring(1, localStorage.getItem('tokenUser').length - 1);
    }

    var idMyUser = localStorage.getItem('idUser');

    useEffect(() => {
        async function userUtility() {
            await api.get(`/usuarios/${id}/`, {
                headers: {
                    Authorization: `Bearer ${loginItem}`,
                    "Content-type": "application/json"
                },
            })
                .then(response => { setUser(response.data) })

            try {
                const responseFollowing = await api.get(`/following/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${loginItem}`,
                        "Content-type": "application/json"
                    },
                })

                setFollowing(responseFollowing.data)
            } catch (error) {
                console.log(error)
            }

            try {
                const responseFollowers = await api.get(`/followers/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${loginItem}`,
                        "Content-type": "application/json"
                    },
                })

                setFollowers(responseFollowers.data)

            } catch (error) {
                console.log(error)
            }

            try {
                const responseFollowing = await api.get(`/following/${idMyUser}/`, {
                    headers: {
                        Authorization: `Bearer ${loginItem}`,
                        "Content-type": "application/json"
                    },
                })

                setMyFollowing(responseFollowing.data)
            } catch (error) {
                console.log(error)
            }

            try {
                const responseFollowers = await api.get(`/followers/${idMyUser}/`, {
                    headers: {
                        Authorization: `Bearer ${loginItem}`,
                        "Content-type": "application/json"
                    },
                })

                setMyFollowers(responseFollowers.data)

            } catch (error) {
                console.log(error)
            }

            setIsFollowingLoaded(true)
        }
        
        userUtility()

    }, [idMyUser, loginItem])
    
    async function goEditProfile() {
        navigate("/edit-profile")
    }

    const fetchFeed = async () => {
        if (page === 1) {
            isFirstPageRef.current = true;
        }

        const headers = {
            Authorization: `Bearer ${loginItem}`,
            "Content-type": "application/json"
        };

        const response = await api.get(`/pubusuario/${id}/?page=${page}`, { headers });
        console.log("pao doce", response.data.results)
        setPublications(prevPublications => [...prevPublications, ...response.data.results]);
    };

    useEffect(() => {
        if (isFirstPageRef.current === false || page !== 1) {
            fetchFeed();
        }
    }, [page]);

    const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 20) {
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
            <Header />
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
                            {(user.super_reviewer === true) ?
                                <SuperCritico />
                                :
                                null
                            }
                            {(isFollowingLoaded && idMyUser != id) && (
                                <>
                                <FollowUnfollow
                                    isFollower={myfollowing.some(
                                        (followingUser) => followingUser.id === Number(id)
                                    )}
                                    id={user.id}
                                />
                                </>
                            )}
                            <p className="bio-text">{user.bio_text}</p>
                            {(idMyUser === id) ?
                                <p className="edit-profile" onClick={goEditProfile}>Editar Perfil</p>
                                :
                                null
                            }
                        </div>
                    </div>
                    <div className={'tabs-profile'}>
                        <Link
                            to={{
                                pathname: `/followers/${id}`,
                            }}
                            state={{
                                prevPath: location.pathname
                            }}
                            style={{ textDecoration: "none", color: "#fff" }}
                        >
                            <p className={'tab-profile'}>{followers.length} Seguidores</p>
                        </Link>
                        <Link
                            to={{
                                pathname: `/following/${id}`,
                            }}
                            state={{
                                prevPath: location.pathname
                            }}
                            style={{ textDecoration: "none", color: "#fff" }}
                        >
                            <p className={'tab-profile'}>{following.length} Seguindo</p>
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
                        />
                    ))}
                </div>
                <div className="right-content">

                </div>
            </div>
        </>
    )
}

export default User;
