import React, { useState, useEffect } from "react";
import './styles.css'
import Menu from '../../components/menu'
import api from "../../api";
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header'
import SuperCritico from '../../components/SuperCritico'

import CardFollower from "../../components/CardFollower";

import { MdArrowBack } from 'react-icons/md';

import { Link } from "react-router-dom";


const Profile = () => {

    const [user, setUser] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

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
                            {user.super_reviewer ? <SuperCritico /> : null}
                            <p className="bio-text">{user.bio_text}</p>
                            <p className="edit-profile" onClick={goEditProfile}>Editar Perfil</p>
                        </div>
                    </div>

                    <div className={'tabs-profile'}>
                        <Link
                            to={`/followers`}
                            style={{ textDecoration: "none", color: "#fff" }}
                        >
                            <p className={'tab-profile'}>{followers.length} Seguidores</p>
                        </Link>
                        <Link
                            to={`/following`}
                            style={{ textDecoration: "none", color: "#fff" }}
                        >
                            <p className={'tab-profile'}>{following.length} Seguindo</p>
                        </Link>
                        <Link
                            to={`/profile`}
                            style={{ textDecoration: "none", color: "#fff" }}
                        >
                            <p className={'tab-profile'}>Críticas</p>
                        </Link>
                        <Link
                            to={`/favoritos`}
                            style={{ textDecoration: "none", color: "#fff" }}
                        >
                            <p className={'tab-profile'}>Favoritos</p>
                        </Link>
                    </div>
                </div>
                <div className="right-content">

                </div>
            </div>
        </>
    )
}

export default Profile;
