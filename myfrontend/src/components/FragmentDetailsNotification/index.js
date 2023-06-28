import React, { useEffect, useState, useNegative } from 'react';
import './styles.css';

import { Link, useNavigate, useLocation } from 'react-router-dom';

import axios from 'axios';

function FragmentDetailsNotification({ user_id, publication_id, message, notification_type, mark_as_read }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Link
      to={notification_type === 'follow' ? `/user/${user_id}` : `/publication/${publication_id}`}
      state={{
        prevPath: location.pathname
      }}
      style={{ textDecoration: "none" }}
    >
      <div className='nofitify-content-inside'>
        <p>{message}</p>
        
        {!mark_as_read && (
          <div className='notification-not-read'></div>
        )}
      </div>
    </Link>
  );
}

export default FragmentDetailsNotification;
