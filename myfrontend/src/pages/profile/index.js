import React, { useState, useEffect } from "react";
import './styles.css'
import Menu from '../../components/menu'
import api from "../../api";
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header'
import SuperCritico from '../../components/SuperCritico'

import CardFollower from "../../components/CardFollower";

import { MdArrowBack } from 'react-icons/md';

const Profile = () => {

    const [user, setUser] = useState([]);
    var loginItem;
    const [selectedTab, setSelectedTab] = useState('profile');

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    const navigate = useNavigate();

    if (localStorage.getItem('tokenUser')) {
        loginItem = localStorage.getItem('tokenUser').substring(1, localStorage.getItem('tokenUser').length - 1);
    }

    var idUser = localStorage.getItem('idUser');

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

    useEffect(() => {
        async function userUtility() {
            await api.get(`/usuarios/${idUser}/`, {
                headers: {
                    Authorization: `Bearer ${loginItem}`,
                    "Content-type": "application/json"
                },
            })
                .then(response => { setUser(response.data) })
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
                {windowSize.width > 680 ? (<div className="left-content">
                    <Menu />
                </div>) :
                    (<Menu />
                )}
                <div className="content-box-profile">
                    {selectedTab === 'profile' && (
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
                    )}

                    {(selectedTab === 'followers' || selectedTab === 'following') && (
                        <div className="followers-info">
                            <button className="back-btn" onClick={() => handleTabClick('profile')}>
                                <MdArrowBack size={32} className="back-icon" />
                            </button>
                            <h1>{user.nickname}</h1>
                        </div>
                    )}

                    <div className={`tabs-profile ${selectedTab === 'followers' || selectedTab === 'following' ? 'tabs-profile colored-tabs' : 'tabs-profile'}`}>
                        <p className={`tab-profile ${selectedTab === 'followers' ? 'active' : ''}`} onClick={() => handleTabClick('followers')}>Seguidores</p>
                        <p className={`tab-profile ${selectedTab === 'following' ? 'active' : ''}`} onClick={() => handleTabClick('following')}>Seguindo</p>
                        {selectedTab !== 'followers' && selectedTab !== 'following' && (
                            <p className={`tab-profile ${selectedTab === 'profile' ? 'active' : ''}`} onClick={() => handleTabClick('profile')}>Críticas</p>
                        )}
                    </div>

                    {selectedTab === 'followers' && (
                        <div className="followers-info-content">
                            <CardFollower
                                id="1"
                                nickname="teste"
                            />
                            <CardFollower
                                id="2"
                                nickname="teste1"
                            />
                            <CardFollower
                                id="3"
                                nickname="teste2"
                            />
                            <CardFollower
                                id="4"
                                nickname="teste3"
                            />
                        </div>
                    )}
                    {selectedTab === 'following' && (
                        <div className="following-info-content">
                             <CardFollower
                                id="1"
                                nickname="teste"
                            />
                            <CardFollower
                                id="2"
                                nickname="teste1"
                            />
                            <CardFollower
                                id="3"
                                nickname="teste2"
                            />
                            <CardFollower
                                id="4"
                                nickname="teste3"
                            />
                        </div>
                    )}
                </div>
                <div className="right-content">

                </div>
            </div>
        </>
    )
}

export default Profile;
