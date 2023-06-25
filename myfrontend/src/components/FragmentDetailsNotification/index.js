import React, { useEffect, useState } from 'react';
import './styles.css';

import { Link } from 'react-router-dom';

import axios from 'axios';

function FragmentDetailsNotification({ idMovie, userName, action }) {
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${idMovie}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=pt-BR`);
      setMovieDetails(response.data);
    }
    fetchData();
  }, [idMovie]);

  return (
    <div className='nofitify-content-inside'>
      {action === "like" ? (
        <p>{`${userName} curtiu sua crítica sobre "${movieDetails?.title}"`}</p>
      ) : action === "comment" ? (
        <p>{`${userName} comentou sua crítica sobre "${movieDetails?.title}"`}</p>
      ) : null}
    </div>
  );
}

export default FragmentDetailsNotification;
