import React from 'react';
import './styles.css';

function CardFollower(props) {
  return (
    <div className="card-follower-content">
        <div className="card" key={props.id}>
          <img src="https://i.imgur.com/piVx6dg.png" alt={props.nickname} className="card-image" />
          <div className="card-details">
            <p className="card-name">{props.nickname}</p>
          </div>
        </div>
    </div>
  );
}

export default CardFollower;