import React, { useEffect, useState } from 'react';
import './styles.css';

import { Link } from 'react-router-dom';

import api from '../../api';

function CardFollower(props) {
  const [isFollowing, setIsFollowing] = useState(props.isFollower)

  useEffect(() => {
    console.log(isFollowing)
  },[])

  async function unfollow(){
    let token = localStorage.getItem('tokenUser')
  
    token = token.substring(1,token.length-1)
    
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    try {
      const response = await api.post(`/usuarios/${props.id}/unfollow/`, null, {headers})
    
      setIsFollowing(false)
    } catch (error) {
      console.log(error)
    } 
  }

  async function follow(){
    let token = localStorage.getItem('tokenUser')
  
    token = token.substring(1,token.length-1)  

    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    try {
      const response = await api.post(`/usuarios/${props.id}/follow/`, null, {headers})

      setIsFollowing(true)
    } catch (error) {
      console.log(error)
    } 
  }

  return (
    <div className="card-follower-content">
        <div className="card" key={props.id}>
          <img src="https://i.imgur.com/piVx6dg.png" alt={props.nickname} className="card-image" />
          <div className={props.isUser ? "card-details" : ""}>
            <Link
              className="card-follower-item"
              to={`/user/${props.id}`}
            >
              <p className="card-name">{props.nickname}</p>
            </Link>
          </div>
          {!props.isUser && 
            <button onClick={isFollowing ? () => unfollow() : () => follow()} className="select-follow-unfollow">
                  {(isFollowing) ?
                  <div id="follow-status">Desseguir</div>
                  :
                  <div id="follow-status">Seguir</div>
                  }
            </button>
          }
        </div>
    </div>
  );
}

export default CardFollower;