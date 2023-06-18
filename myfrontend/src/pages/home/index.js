import React, { useState, useEffect, useRef } from "react";

import axios from 'axios';
import styles from './styles.css';

import Publication from "../../components/Publication";
import Header from "../../components/header";
import HeaderDesktop from "../../components/headerDesktop";

import Menu from "../../components/menu";
import ViewPublication from "../../components/ViewPublication";

import api from "../../api";

const Home = () => {
    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(1);
    const isFirstPageRef = useRef(false);

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

    const fetchFeed = async () => {
        if (page === 1) {
            isFirstPageRef.current = true;
        }

        const response = await api.get(`feed/?page=${page}`);
        setPublications(prevPublications => [...prevPublications, ...response.data.results]);
    };

    useEffect(() => {
        if (isFirstPageRef.current === false || page !== 1) {
            fetchFeed();
        }
    }, [page]);

    const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 0) {
            setPage(page + 1);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    var idUser = localStorage.getItem('idUser');

    return (
        <>
        {(window.innerWidth > 760)?
            <HeaderDesktop/>
        :
        
            <Header />
        }
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
                    {publications.map((publication) => (
                        <ViewPublication
                            userID={publication.user_id}
                            idPost={publication?.date?.slice(20) + publication?.movie_id}
                            idMovie={publication.movie_id}
                            rating={publication.review}
                            critic={publication.pub_text}
                            image={publication?.imgur_link}
                            date={publication.date}
                            myPub={(publication.user_id === parseInt(idUser)) ? true : false}
                        />
                    ))}
                </div>
                <div className="home-right-content">

                </div>
            </div>
        </>
    )
}

export default Home;

