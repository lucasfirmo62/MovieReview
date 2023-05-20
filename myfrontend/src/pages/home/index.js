import React, { useState, useEffect } from "react";

import styles from './styles.css';

import Publication from "../../components/Publication";
import Header from "../../components/header";
import Menu from "../../components/menu";



const Home = () => {

    return (
        <>
            <Header />
            <div className="content-home">
                <div className="home-left-content">
                    <Menu />
                </div>
                <div id="content-box-home" className="content-box-home">
                    <Publication />
                </div>
                <div className="home-right-content">

                </div>
            </div>
        </>
    )
}

export default Home;

