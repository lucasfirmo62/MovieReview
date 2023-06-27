import React, { useEffect, useState } from 'react';
import './styles.css';

import posternotfound from '../../assets/posternotfound.png'

import { FaStar } from 'react-icons/fa';
import { IoMdEye } from 'react-icons/io';

import { Link } from 'react-router-dom';

const MovieCard = (props) => {

    return (
        <>
            <div className='similar-movie-item'>
                <img
                    src={props?.poster ? `https://image.tmdb.org/t/p/w500/${props?.poster}` : posternotfound}
                    alt={props.title}
                />
                <div className='similar-movie-info'>
                    <p onClick={() => props.navigateAnotherMoviePage(props.movie_id)}>{props.title}</p>
                </div>
            </div>
        </>
    )
}

export default MovieCard;
