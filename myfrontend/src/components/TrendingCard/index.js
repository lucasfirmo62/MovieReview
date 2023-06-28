import React from "react";

import './styles.css';

import { Link } from "react-router-dom";

import api from "../../api";

const TrendingCard = (props) => {
    let id = localStorage.getItem("idUser");
    id = id.substring(1, id.length - 1);

    async function unfollow() {
        try {
            const response = await api.post(`/usuarios/${props.id}/unfollow/`, null)

            const index = props.index;

            props.setSuperReviewers(prevSuperReviewers => {
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

    async function follow() {
        try {
            const response = await api.post(`/usuarios/${props.id}/follow/`, null)

            const index = props.index;

            props.setSuperReviewers(prevSuperReviewers => {
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
            <div className="trending-card-content">
                {props.profile_image ?
                    <img src={props.profile_image} />
                    :
                    <img src={"https://i.imgur.com/piVx6dg.png"} />
                }
                <Link to={`/user/${props.id}`} style={{ textDecoration: 'none' }}>
                    <h3>{props.name}</h3>
                </Link>
                {props.id != id && (
                <button onClick={props.is_followed ? () => unfollow() : () => follow()} className="select-follow-unfollow">
                    {(props.is_followed) ?
                        <div id="follow-status">Desseguir</div>
                        :
                        <div id="follow-status">Seguir</div>
                    }
                </button>)}
            </div>

        </>
    )
}

export default TrendingCard;