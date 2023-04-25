import React from "react";
import './styles.css'
import Menu from '../../components/menu'
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header'

const Profile = () => {

    const navigate = useNavigate();


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
                            <p className="name-user">untitled name</p>
                            <p className="username-text">@untitledUsername</p>
                            <p className="bio-text">Adicione algo sobre você aqui</p>
                            <p className="edit-profile" onClick={goEditProfile}>Editar Perfil</p>
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

export default Profile;
