import React, { useState, useEffect } from "react";
import './styles.css';


const FollowUnfollow = () => {

    const follow = true;

    async function unfollowFollow(){
        let status = document.getElementById("follow-status").innerHTML;
        if(status === "DesSeguir"){
            document.getElementById("follow-status").innerHTML = "Seguir";
            return
        }
        if(status === "Seguir"){
            document.getElementById("follow-status").innerHTML = "DesSeguir";
            return
        }
    }

    return (
        <>
            <button onClick={unfollowFollow} className="select-follow-unfollow">
                {(follow) ?
                <div id="follow-status">DesSeguir</div>
                :
                <div id="follow-status">Seguir</div>
                }
            </button>

        </>
    )
}

export default FollowUnfollow;






