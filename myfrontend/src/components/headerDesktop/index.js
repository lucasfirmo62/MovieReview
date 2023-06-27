import React, { useState, useEffect } from "react";
import './styles.css';

import { FaSearch } from 'react-icons/fa';

import { Link, useNavigate, useLocation } from 'react-router-dom';

import logo from '../../assets/logotype.png'

import { MdNotifications } from 'react-icons/md';

import axios from "axios";

import FragmentDetailsNotification from "../FragmentDetailsNotification";

import api from '../../api';

const HeaderDesktop = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchType, setSearchType] = useState("movies");
    const [notifications, setNotifications] = useState([]);

    const [notReadNotifications, setNotReadNotifications] = useState([]);
    const [notReadNotificationsNumber, setNotReadNotificationsNumber] = useState([]);

    let id = localStorage.getItem("idUser");
    id = id.substring(1, id.length - 1);

    function handleSubmit(event) {
        event.preventDefault();

        const query = event.target.elements.search.value.replace(/\s+/g, '+');

        if (searchType === "users") {
            navigate(`/search?user=${query}`);
        } else {
            navigate(`/search?query=${query}`);
        }
    }

    let galop = document.getElementById('content-notification');
    let button = document.getElementById('more-notify');

    if (galop) {
        galop.style.backgroundColor = 'rgba(255, 255, 255, 0)'
        galop.style.display = 'none'
    }

    async function notificationNow() {     
        let galop = document.getElementById('content-notification');
        let button = document.getElementById('more-notify');

        button.style.display = 'block';
        galop.style.backgroundColor = 'rgba(255, 255, 255, 0.89)'
        if (galop.style.display === "block") {
            galop.style.display = 'none';
        }
        else if (galop.style.display === "none") {
            galop.style.display = 'block';
        }

        try {
            await api.post('/notificacoes/mark_as_read/')
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        api.get('/notificacoes/')
            .then(response => {
                setNotifications(response.data.results);

                const unreadNotifications = response.data.results.filter((notification) => notification.is_read == false);

                setNotReadNotifications(unreadNotifications);

                if (response.data.results.length > 0)
                    setNotReadNotificationsNumber(response.data.results[0].not_read_count);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        const addEventListeners = () => {
            const moviesCheckbox = document.getElementById("movies");
            const usersCheckbox = document.getElementById("users");

            if (moviesCheckbox && usersCheckbox) {
                moviesCheckbox.addEventListener("change", handleMoviesChange);
                usersCheckbox.addEventListener("change", handleUsersChange);
            }
        };

        const handleMoviesChange = () => {
            const moviesCheckbox = document.getElementById("movies");
            const moviesChecked = moviesCheckbox.checked;
            setSearchType(moviesChecked ? "movies" : "users");
        };

        const handleUsersChange = () => {
            const usersCheckbox = document.getElementById("users");
            const usersChecked = usersCheckbox.checked;
            setSearchType(usersChecked ? "users" : "movies");
        };

        addEventListeners();

        return () => {
            const moviesCheckbox = document.getElementById("movies");
            const usersCheckbox = document.getElementById("users");

            if (moviesCheckbox && usersCheckbox) {
                moviesCheckbox.removeEventListener("change", handleMoviesChange);
                usersCheckbox.removeEventListener("change", handleUsersChange);
            }
        };
    }, []);

    const radioButtons = document.querySelectorAll('.option-conf-search');

    function handleRadioButtonChange() {
        let checkedId = null;

        var checkedM = document.getElementById(`moviesL`);
        checkedM.style.backgroundColor = "rgba(119, 119, 119, 0)";
        var checkedU = document.getElementById(`usersL`);
        checkedU.style.backgroundColor = "rgba(119, 119, 119, 0)";

        radioButtons.forEach(radioButton => {
            if (radioButton.checked) {
                checkedId = radioButton.id;
                return;
            }
        });

        if (checkedId) {
            const checkedElement = document.getElementById(`${checkedId}L`);
            var name = checkedElement.getAttribute('name')
            console.log(name)
            document.getElementById("select-bar-search").innerHTML = name;
            console.log('ID do radio button marcado:', checkedId);
        }
    }

    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('change', handleRadioButtonChange);
    });

    async function selectSearch() {
        var filterOptions = document.getElementById('option-conf-search-back');
        filterOptions.style.display = "block";
        setTimeout(function () {
            var checkedM = document.getElementById(`moviesL`);
            if (checkedM) {
                handleRadioButtonChange()
            }
        }, 100);
    }

    async function closeOptions() {
        var filterOptions = document.getElementById('option-conf-search-back');
        filterOptions.style.display = "block";
        if (filterOptions.style.display === "block") {
            filterOptions.style.display = 'none';
        }
    }

    return (
        <>
            <header className={'header-open'}>
                <div className={'div-open'}>
                    <Link to="/">
                        <img
                            className={'img-open'}
                            src={logo} alt="Logo do site"
                        />
                    </Link>
                    <form
                        onSubmit={handleSubmit}
                        className={'form-close'}
                    >
                        <FaSearch
                            color="black"
                            className="search-icon"
                        />

                        <input
                            className={'input-open'}
                            type="text"
                            placeholder={searchType === "movies" ? "Pesquisar Filmes" : "Pesquisar Usuários"}
                            name="search"
                        />
                        <div id="select-bar-search" className="select-bar-search" onClick={selectSearch}>
                            Filmes
                        </div>
                        <div id="option-conf-search-back" className="option-conf-search-back">
                            <label name="Filmes" className="button-radio" id="moviesL" onClick={closeOptions}>
                                <input
                                    id="movies"
                                    type="radio"
                                    name="searchType"
                                    className="option-conf-search"
                                    value="movies"
                                    checked={searchType === "movies"}
                                    onChange={() => setSearchType("movies")}
                                />
                                Filmes
                            </label>
                            <label name="Usuários" className="button-radio" id="usersL" onClick={closeOptions}>
                                <input
                                    id="users"
                                    type="radio"
                                    name="searchType"
                                    className="option-conf-search"
                                    value="users"
                                    checked={searchType === "users"}
                                    onChange={() => setSearchType("users")}
                                />
                                Usuários
                            </label>
                        </div>
                    </form>
                    <div className="ntf-cation" onClick={notificationNow}>
                        <MdNotifications className="notification" />
                        {notReadNotificationsNumber != 0 && notReadNotificationsNumber > 10 && (<div className="ntf-number">10+</div>)}
                        {notReadNotificationsNumber != 0 && notReadNotificationsNumber <= 10 && (<div className="ntf-number">{notReadNotificationsNumber}</div>)}
                    </div>
                    {notifications.length > 0 ? (
                        <div id="content-notification" className="content-notification">
                            {notifications.map((notification) => (
                                <div key={notification.idPost} className="nofitify-content-inside">
                                    <FragmentDetailsNotification
                                        publication_id={notification.publication}
                                        user_id={notification.sender}
                                        message={notification.message}
                                        notification_type={notification.notification_type}
                                        mark_as_read={notification.is_read}
                                    />
                                </div>
                            ))}
                            <Link
                                to={`/notifications/${id}`}
                                state={{
                                    prevPath: location.pathname
                                }}
                                style={{ textDecoration: "none", color: "#000" }}
                            >
                                <div id="more-notify" className="more-notify"><p>Ver mais</p></div>
                            </Link>
                        </div>
                    ) : (
                        <div id="content-notification" className="content-notification">
                            <div id="more-notify" className="more-notify no-notification"><p>Não há notificações!</p></div>
                        </div>
                    )}
                </div>
            </header>
        </>
    )
}

export default HeaderDesktop;