import React, { useState, useEffect } from "react";

import axios from 'axios';
import styles from './styles.css';

import Publication from "../../components/Publication";
import Header from "../../components/header";
import Menu from "../../components/menu";

const Home = () => {
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

    return (
        <>
            <Header />
            <div className="content-home">
                 {windowSize.width < 680
                    ?
                    (
                        <Menu />
                    )
                    :
                    <div className="home-left-content">
                        <Menu />
                    </div>
                }
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

