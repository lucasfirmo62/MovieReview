import React, { useState, useEffect } from "react";
import Menu from '../../components/menu'
import api from "../../api";
import Header from '../../components/header'

import CardFollower from "../../components/CardFollower";

import { MdArrowBack } from 'react-icons/md';

import { Link, useNavigate } from "react-router-dom";

const Following = ({ nickname }) => {
    const [user, setUser] = useState([])
    const [following, setFollowing] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const handlePopstate = () => {
            navigate.push('/profile');
        };

        window.addEventListener('popstate', handlePopstate);

        return () => {
            window.removeEventListener('popstate', handlePopstate);
        };
    }, [navigate]);

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

    var loginItem;

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
        }

        userUtility()
    }, [idUser, loginItem])

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
                    <div className="followers-info">

                        <Link
                            className="back-btn"
                            to={`/profile`}
                            style={{ textDecoration: "none", color: "#fff" }}
                        >
                            <MdArrowBack size={32} className="back-icon" />
                        </Link>

                        <h1>{user.nickname}</h1>
                    </div>

                    <div className="tabs-profile">
                        <Link
                            to={`/followers`}
                            style={{ textDecoration: "none", color: "#fff" }}
                        >
                            <p className='tab-profile'>Seguidores</p>
                        </Link>

                        <Link
                            to={`/following`}
                            style={{ textDecoration: "none", color: "#fff" }}
                        >
                            <p className='tab-profile'>Seguindo</p>
                        </Link>
                    </div>
                    <div className="followers-info-content">
                        <CardFollower
                            id={1}
                            nickname={"teste1"}
                        />
                        <CardFollower
                            id={2}
                            nickname={"teste2"}
                        />
                        <CardFollower
                            id={3}
                            nickname={"teste3"}
                        />
                    </div>
                </div>

                <div className="right-content">

                </div>
            </div >
        </>
    )
}

export default Following;
