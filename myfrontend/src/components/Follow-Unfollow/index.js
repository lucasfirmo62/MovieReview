import React, { useState, useEffect } from "react";
import './styles.css';

import api from "../../api";

const FollowUnfollow = (props) => {

    const [isFollowing, setIsFollowing] = useState(props.isFollower)

    async function unfollow() {
        try {
            const response = await api.post(`/usuarios/${props.id}/unfollow/`, null)

            setIsFollowing(false)
        } catch (error) {
            console.log(error)
        }
    }

    async function follow() {
        try {
            const response = await api.post(`/usuarios/${props.id}/follow/`, null)

            setIsFollowing(true)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <button onClick={isFollowing ? () => unfollow() : () => follow()} className="select-follow-unfollow">
                {(isFollowing) ?
                    <div id="follow-status">Desseguir</div>
                    :
                    <div id="follow-status">Seguir</div>
                }
            </button>

        </>
    )
}

export default FollowUnfollow;






