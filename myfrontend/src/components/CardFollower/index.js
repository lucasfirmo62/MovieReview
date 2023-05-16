import React from 'react';
import './styles.css';

import { Link } from 'react-router-dom';

function CardFollower(props) {
  const follow = true;

  async function unfollowFollow(){
   
  }

  // introduzir o link para a página do usuário e introduzir o botão de seguir e deixar de seguir

  return (
    <div className="card-follower-content">
        <div className="card" key={props.id}>
          <img src="https://i.imgur.com/piVx6dg.png" alt={props.nickname} className="card-image" />
          <div className="card-details">
            <Link
              className="card-follower-item"
              to={`/user/${props.id}`}
            >
              <p className="card-name">{props.nickname}</p>
            </Link>
          </div>
          <button className="select-follow-unfollow">
                {(follow) ?
                <div id="follow-status">Desseguir</div>
                :
                <div id="follow-status">Seguir</div>
                }
          </button>
        </div>
    </div>
  );
}

export default CardFollower;