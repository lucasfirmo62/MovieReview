import React, { useState, useEffect } from "react";

import axios from 'axios';
import styles from './styles.css';

import Publication from "../../components/Publication";
import Header from "../../components/header";
import HeaderDesktop from "../../components/headerDesktop";

import Menu from "../../components/menu";

const Home = () => {
    return (
        <>
        {(window.innerWidth > 760)?
            <HeaderDesktop/>
        :
        
            <Header />
        }
            <div className="content-home">
                <div className="home-left-content">
                    <Menu />
                </div>
                <div className="content-box-home">
                    <Publication />
                </div>
                <div className="home-right-content">

                </div>
            </div>
        </>
    )
}

export default Home;

