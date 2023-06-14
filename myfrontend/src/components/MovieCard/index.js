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
                
                {/* <div className='button-options'>
                    <button>
                        <FaStar color='white' size={24} />
                    </button>
                    <button>
                        <IoMdEye color='white' size={24} />
                    </button>
                </div> */}
                
                <div className='similar-movie-info'>
                    <p onClick={() => props.navigateAnotherMoviePage(props.movie_id)}>{props.title}</p>
                </div>
            </div>
        </>
    )
}

export default MovieCard;























{/* <button style={{ maxWidth: 'max-content' }} id="favoritar-button" className="favoritar-button" onClick={isMovieFavorite ? toggleDesfavoritar : toggleFavoritar}> */ }
{/* <FaStar color={'gold'} size={20} /> */ }
{/* </button> */ }
{/* <button style={{ maxWidth: '100%' }} id="favoritar-button" className="favoritar-button" onClick={isWatchlistSettled ? toggleRemovetoWatchlist : toggleAddToWatchlist}> */ }
{/* <IoMdEye color={'#e90074'} size={20} /> */ }
{/* <span>Assistir Depois</span> */ }
{/* </button> */ }