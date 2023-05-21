import React, { useState, useEffect } from "react";

import axios from 'axios';
import styles from './styles.css';

import Publication from "../../components/Publication";
import Header from "../../components/header";
import Menu from "../../components/menu";
import ViewPublication from "../../components/ViewPublication";

const Home = () => {
    const [publications, setPublications] = useState([]);

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
        const fetchData = async () => {
            const response = await axios.get('https://api.npoint.io/f505aab832e19325c051');
            setPublications(response.data.publications);
        };

        fetchData();
    }, []);

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
                    {publications.map((publication) => (
                        <ViewPublication
                            userName={publication.userName}
                            userID={publication.userID}
                            idPost={publication.idPost}
                            idMovie={publication.idMovie}
                            rating={publication.rating}
                            critic={publication.critic}
                            image={publication?.image}
                            date={publication.date}
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

