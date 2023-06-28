import React, {useState} from "react";
import './styles.css'
import { AiFillHome } from 'react-icons/ai';
import { BsFillBookmarkStarFill } from 'react-icons/bs';
import { BiLogOut } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';

import api from '../../api';

const Menu = () => {
    const navigate = useNavigate();

    async function goHome(){
        navigate("/")
    }

    async function goProfile(){
        navigate("/profile")
    }

    const handleLogout = () => {
        let refresh = localStorage.getItem("refreshTokenUser")

        refresh = refresh.substring(1, refresh.length - 1);

        const body = {
            "refresh": refresh
        }

        api.post("/logout/", body)
            .then((res) => {
                localStorage.setItem("tokenUser", "")
                localStorage.setItem("refreshTokenUser", "")
                navigate("/login");
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <>
            <div className="content-menu"></div>
            <div className="menu-contrast">
                <div className="menu-contrast">
                    <div className="inside-menu" onClick={goHome}><AiFillHome className="icon"/><p>Home</p></div>
                    <div className="inside-menu" onClick={goProfile}><CgProfile className="icon"/><p>Perfil</p></div>
                    <div style={{color: '#e90074'}} className="inside-menu" onClick={handleLogout}><BiLogOut className="icon"/><p>Sair</p></div>
                </div>
            </div>
        </>
    )
}

export default Menu;