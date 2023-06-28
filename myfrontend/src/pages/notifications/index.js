import React, { useState, useEffect } from "react";

import './styles.css';

import Header from "../../components/header";
import HeaderDesktop from "../../components/headerDesktop";

import Menu from "../../components/menu";

import { Link } from "react-router-dom";

import { MdArrowBack } from "react-icons/md";

import Pagination from "../../components/pagination";

import CardNotification from '../../components/CardNotification';

import api from "../../api";

const Notifications = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [notifications, setNotifications] = useState([]);
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [notReadNotificationsNumber, setNotReadNotificationsNumber] = useState([]);

    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    async function get_notifications_data() {
        try {
            const response = await api.get(`/notificacoes/?page=${currentPage}`)

            setNotifications(response.data.results)

            setNotificationsCount(response.data.count)

            const unreadNotifications = response.data.results.filter((notification) => notification.is_read === false);

            setNotReadNotificationsNumber(unreadNotifications.length)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        get_notifications_data()
    }, [currentPage])

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])

    function handlePageChange(event, pageNumber) {
        event.preventDefault();
        setCurrentPage(pageNumber);
    }

    return (
        <>
            {(window.innerWidth > 760) ?
                <HeaderDesktop />
                :

                <Header />
            }

            <div className="content-home">
                {windowSize.width < 680
                    ?
                    (
                        <Menu />
                    )
                    :
                    <div className="home-left-content">
                        <Menu />
                    </div>
                }

                <div className="content-box-home">
                    <div className="followers-info">
                        <Link
                            className="back-btn"
                            to={'/'}
                            style={{ textDecoration: "none", color: "#fff" }}
                        >
                            <MdArrowBack size={32} className="back-icon" />
                        </Link>

                        <h2>Notificações</h2>
                    </div>

                    {notifications.map((notification) => (
                        <CardNotification
                            key={notification.id}
                            message={notification.message}
                            notification_type={notification.notification_type}
                            user_id={notification.sender}
                            publication_id={notification.publication}
                            mark_as_read={notification.is_read}
                        />
                    ))}

                    <div className="notifications-pagination">
                        <Pagination
                            totalPages={Math.ceil(notificationsCount / 20) > 7 ? 7 : Math.ceil(notificationsCount/20)}
                            currentPage={1}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>

                <div className="home-right-content">
                </div>
            </div>
        </>
    )
}

export default Notifications;