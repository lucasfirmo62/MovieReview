import React, { useState, useEffect } from "react";
import './styles.css';

import api from "../../api";

const FollowUnfollow = (props) => {

    const [isFollowing, setIsFollowing] = useState(props.isFollower)

    async function unfollow() {
        let token = localStorage.getItem('tokenUser')

        token = token.substring(1, token.length - 1)

        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

        try {
            const response = await api.post(`/usuarios/${props.id}/unfollow/`, null, { headers })

            setIsFollowing(false)
        } catch (error) {
            console.log(error)
        }
    }

    async function follow() {
        console.log("user")
        let token = localStorage.getItem('tokenUser')

        token = token.substring(1, token.length - 1)

        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

        try {
            const response = await api.post(`/usuarios/${props.id}/follow/`, null, { headers })

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






