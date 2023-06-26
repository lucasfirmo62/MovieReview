import React from "react";
import './styles.css';

import { Link, useNavigate, useLocation } from "react-router-dom";

const CardNotification = ({ message, notification_type, user_id, publication_id, mark_as_read }) => {
    const location = useLocation();

    return (
        <>
            <Link
                to={notification_type === 'follow' ? `/user/${user_id}` : `/publication/${publication_id}`}
                state={{
                    prevPath: location.pathname
                }}
                style={{ textDecoration: "none" }}
            >
                <div className="card-notification-content">
                    <p>{message}</p>
                    {/* {!mark_as_read && (
                        <div className='notification-not-read'></div>
                    )} */}
                </div>
            </Link>
        </>
    )
}

export default CardNotification;