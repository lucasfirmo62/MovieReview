import React, { useState, useEffect } from "react";
import './styles.css'
import api from "../../api";
import Menu from '../../components/menu'
import Header from '../../components/header'
import { useNavigate } from 'react-router-dom';
import SuperCritico from '../../components/SuperCritico'

const User = () => {

    const url = window.location.href;
    const id = url.split('user/')[1];

    const [user, setUser] = useState([]);

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

        }
        userUtility()
    }, [idMyUser, loginItem])

    async function goEditProfile() {
        navigate("/edit-profile")
    }

    return (
        <>
            <Header />
            <div className="content-all">
                <div className="left-content">
                    <Menu />
                </div>
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
                            <p className="bio-text">{user.bio_text}</p>
                            {(idMyUser === id) ?
                                <p className="edit-profile" onClick={goEditProfile}>Editar Perfil</p>
                                :
                                null
                            }
                        </div>
                    </div>
                    <div className="tabs-profile">
                        <p className="tab-profile">Followers</p>
                        <p className="tab-profile">Following</p>
                        <p className="tab-profile">Críticas</p>
                    </div>
                </div>
                <div className="right-content">

                </div>
            </div>
        </>
    )
}

export default User;
