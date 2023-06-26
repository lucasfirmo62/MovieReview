import React, { useState, useEffect } from "react";

import './styles.css';

import Header from "../../components/header";
import HeaderDesktop from "../../components/headerDesktop";

import Menu from "../../components/menu";

import TrendingCard from "../../components/TrendingCard";

import { Link } from "react-router-dom";

import { MdArrowBack } from "react-icons/md";

import Pagination from "../../components/pagination";

import api from "../../api";

const Supercriticos = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [superReviewersCount, setSuperReviewersCount] = useState(0)
    const [superReviewers, setSuperReviewers] = useState([])

    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    async function get_super_reviewers_data() {
        try {
            const response = await api.get(`/supercriticos/?page=${currentPage}`)
            setSuperReviewers(response.data.results)
            setSuperReviewersCount(response.data.count)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        get_super_reviewers_data()
    }, [currentPage])

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
                    
                    {superReviewers.length > 0 && superReviewers.map((superReviewer, index) => {
                        return(
                            <TrendingCard 
                                id={superReviewer.id}
                                name={superReviewer.nickname}
                                is_followed={superReviewer.is_followed}
                                profile_image={superReviewer.profile_image}
                                index={index}
                                setSuperReviewers={setSuperReviewers}
                            /> 
                        )
                    })}

                    <div className="supercriticos-pagination">
                        <Pagination
                            totalPages={Math.ceil(superReviewersCount / 10) > 7 ? 7 : Math.ceil(superReviewersCount/10)}
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


                    {/* exibir uma mensagem caso não tenha supercriticos e não exibir o card caso não tenha supecriticos */}
