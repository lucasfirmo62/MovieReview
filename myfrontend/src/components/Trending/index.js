import React, { useEffect, useState } from "react";
import './styles.css';

import { Link } from "react-router-dom";

import api from "../../api";

import { FaPlus, FaCheck } from 'react-icons/fa'
import { BsCheckCircleFill } from 'react-icons/bs'

const Trending = () => {
    let idMyUser = localStorage.getItem("idUser");
    idMyUser = idMyUser.substring(1, idMyUser.length - 1);

    const [superReviewers, setSuperReviewers] = useState([])

    useEffect(() => {
        async function get_super_reviewers_data() {
            try {
                const response = await api.get('/supercriticos/?page=1')
                setSuperReviewers(response.data.results)
                console.log(response.data.results)
            } catch (error) {
                console.log(error)
            }
        }

        get_super_reviewers_data()
    }, [])

    async function unfollow(id, index) {
        try {
            const response = await api.post(`/usuarios/${id}/unfollow/`, null)

            setSuperReviewers(prevSuperReviewers => {
                const newSuperReviewers = [...prevSuperReviewers]; 
            
                newSuperReviewers[index] = {
                  ...newSuperReviewers[index],
                  'is_followed': false
                };
            
                return newSuperReviewers; 
              });
        } catch (error) {
            console.log(error)
        }
    }

    async function follow(id, index) {
        try {
            const response = await api.post(`/usuarios/${id}/follow/`, null)

            setSuperReviewers(prevSuperReviewers => {
                const newSuperReviewers = [...prevSuperReviewers]; 
            
                newSuperReviewers[index] = {
                  ...newSuperReviewers[index],
                  'is_followed': true
                };
            
                return newSuperReviewers; 
              });
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className="trending-content">
                <h2>Super Críticos</h2>

                {superReviewers.length > 0 && superReviewers.slice(0, 5).map((superReviewer, index) => {
                    return (
                        <div className="trending-item">
                            {superReviewer.profile_image
                                ?
                                <img className="image-user" alt="user" src={superReviewer.profile_image} />
                                :
                                <img className="image-user" alt="user" src={"https://i.imgur.com/piVx6dg.png"} />
                            }
                            <Link to={`/user/${superReviewer.id}`} style={{ textDecoration: 'none' }}>
                                <p>{superReviewer.nickname}</p>
                            </Link>

                            {idMyUser != superReviewer.id && (<button className="select-follow-unfollow" style={{ backgroundColor: (superReviewer.is_followed ? '#e90074' : 'rgba(0,0,0,0.5)') }} onClick={superReviewer.is_followed ? () => unfollow(superReviewer.id, index) : () => follow(superReviewer.id, index)}>
                                {(superReviewer.is_followed) ?
                                    <div id="follow-status"><FaCheck size={12} /></div>
                                    :
                                    <div id="follow-status"><FaPlus size={12} /></div>
                                }
                            </button>)}
                        </div>
                    )
                })}

                {superReviewers.length == 0 && (
                    <div>
                        <div className="trending-item final">
                            <p style={{ color: "#000" }}>Não existem supercríticos</p>
                        </div>
                    </div>
                )}

                {superReviewers.length > 0 && (
                    <div className="trending-item final">
                        <Link to="supercriticos/" style={{ textDecoration: 'none' }}>
                            <p>Ver mais...</p>
                        </Link>
                    </div>
                )}
            </div>
        </>
    )
}

export default Trending;



















{/* <div className="trending-item">
                    <img className="image-user" alt="user" src={"https://i.pinimg.com/550x/ef/f3/db/eff3dbf3ddb97b7232e742a97206cc93.jpg"} />
                    <p>Lucas Lima</p>
                </div>
                <div className="trending-item">
                    <img className="image-user" alt="user" src={"https://i.pinimg.com/550x/ef/f3/db/eff3dbf3ddb97b7232e742a97206cc93.jpg"} />
                    <p>Diego Alves</p>
                </div>
                <div className="trending-item">
                    <img className="image-user" alt="user" src={"https://i.pinimg.com/550x/ef/f3/db/eff3dbf3ddb97b7232e742a97206cc93.jpg"} />
                    <p>Neymar Junior</p>
                </div>
                <div className="trending-item">
                    <img className="image-user" alt="user" src={"https://i.pinimg.com/736x/fd/fc/ef/fdfcefc24e58a4e3ed4dd6099d530353.jpg"} />
                    <p>Diego Alves</p>
                </div>
                <div className="trending-item">
                    <img className="image-user" alt="user" src={"https://i.pinimg.com/736x/fd/fc/ef/fdfcefc24e58a4e3ed4dd6099d530353.jpg"} />
                    <p>Neymar Junior</p>
                </div> */}