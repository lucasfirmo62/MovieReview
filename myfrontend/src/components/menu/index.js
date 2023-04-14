import React from "react";
import './styles.css'
import { AiFillHome } from 'react-icons/ai';
import { BsFillBookmarkStarFill } from 'react-icons/bs';
import { BiLogOut } from 'react-icons/bi';


const Menu = () => {

    return (
        <>
            <div className="content-menu"></div>
            <div className="menu-contrast">
                <div className="menu-contrast">
                    <div className="inside-menu"><AiFillHome className="icon"/><p>Home</p></div>
                    <div className="inside-menu"><BsFillBookmarkStarFill className="icon"/><p>Favoritos</p></div>
                    <div className="inside-menu"><BiLogOut className="icon"/><p>Sair</p></div>
                </div>
            </div>
        </>
    )
}

export default Menu;