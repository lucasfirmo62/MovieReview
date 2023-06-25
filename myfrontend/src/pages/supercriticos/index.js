import React, { useState, useEffect } from "react";

import './styles.css';

import Header from "../../components/header";
import HeaderDesktop from "../../components/headerDesktop";

import Menu from "../../components/menu";

import TrendingCard from "../../components/TrendingCard";

import { Link } from "react-router-dom";

import { MdArrowBack } from "react-icons/md";

import Pagination from "../../components/pagination";

const Supercriticos = () => {
    const [currentPage, setCurrentPage] = useState(1);

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

    function handlePageChange(event, pageNumber) {
        event.preventDefault();
        setCurrentPage(pageNumber);
    }

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
                    <div className="followers-info">
                        <Link
                            className="back-btn"
                            to={'/'}
                            style={{ textDecoration: "none", color: "#fff" }}
                        >
                            <MdArrowBack size={32} className="back-icon" />
                        </Link>

                        <h2>Super Críticos</h2>
                    </div>
                    
                    <TrendingCard />
                    <TrendingCard />
                    <TrendingCard />
                    <TrendingCard />
                    <TrendingCard />
                    <TrendingCard />
                    <TrendingCard />
                    <TrendingCard />
                    <TrendingCard />
                    <TrendingCard />
                    <TrendingCard />
                    <TrendingCard />
                    <TrendingCard />
                    <TrendingCard />
                    <TrendingCard />
                    <TrendingCard />
                    <TrendingCard />
                    <TrendingCard />
                    <TrendingCard />
                    <TrendingCard />

                    <div className="supercriticos-pagination">
                        <Pagination
                            totalPages={5}
                            currentPage={1}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
                <div className="home-right-content">
                </div>
            </div>
        </>
    )
}

export default Supercriticos;