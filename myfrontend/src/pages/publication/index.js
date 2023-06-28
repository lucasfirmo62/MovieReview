import React, { useEffect, useState } from "react";
import './styles.css';

import Header from "../../components/header";
import HeaderDesktop from "../../components/headerDesktop";

import ViewPublication from '../../components/ViewPublication';

import api from "../../api";

import { useParams, useLocation } from 'react-router-dom';

import Menu from "../../components/menu";

import { Link } from "react-router-dom";

import { MdArrowBack } from "react-icons/md";

const Publication = () => {
    const { id } = useParams();

    const [publication, setPublication] = useState(null)

    const location = useLocation();

    const backButtonRoute = location.state?.prevPath || '/';

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
        async function get_publication() {
            const response = await api.get(`/publicacoes/${id}/`)
            setPublication(response.data)
        }

        get_publication()
    }, [])

    return (
        <>
            {(window.innerWidth > 760) ?
                <HeaderDesktop />
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
                    <div className="title-content">
                        <Link
                            className="back-btn"
                            to={backButtonRoute}
                            style={{ textDecoration: "none", color: "#fff" }}
                        >
                            <MdArrowBack size={32} className="back-icon" />
                        </Link>
                        <h1 className="title-component">Publicação</h1>
                    </div>

                    {publication !== null && (<ViewPublication
                        userID={publication.user_id}
                        idPost={publication?.id}
                        idMovie={publication.movie_id}
                        rating={publication.review}
                        critic={publication.pub_text}
                        image={publication?.imgur_link}
                        date={publication.date}
                        myPub={false}
                    />)}
                </div>
                <div className="home-right-content">

                </div>
            </div>
        </>
    )
}

export default Publication;
