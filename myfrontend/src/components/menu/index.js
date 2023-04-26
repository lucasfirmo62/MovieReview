import React from "react";
import './styles.css'
import { AiFillHome } from 'react-icons/ai';
import { BsFillBookmarkStarFill } from 'react-icons/bs';
import { BiLogOut } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';

const Menu = () => {

    const navigate = useNavigate();

    async function goHome(){
        navigate("/")
    }

    async function goProfile(){
        navigate("/profile")
    }

    return (
        <>
            <div className="content-menu"></div>
            <div className="menu-contrast">
                <div className="menu-contrast">
                    <div className="inside-menu" onClick={goHome}><AiFillHome className="icon"/><p>Home</p></div>
                    <div className="inside-menu" onClick={goProfile}><CgProfile className="icon"/><p>Perfil</p></div>
                    <div className="inside-menu"><BiLogOut className="icon"/><p>Sair</p></div>
                </div>
            </div>
        </>
    )
}

export default Menu;