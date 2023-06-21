import React, { useState, useEffect } from "react";
import './styles.css';
import { MdNotifications } from 'react-icons/md';
import { FaSearch } from 'react-icons/fa';
import { MdArrowBack } from "react-icons/md";
import axios from "axios";
import FragmentDetailsNotification from "../FragmentDetailsNotification";
import { Link, useNavigate } from 'react-router-dom';

import logo from '../../assets/logotype.png'

const Header = () => {
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchType, setSearchType] = useState("movies");
    const [notifications, setNotifications] = useState([]);

    const handleSearchIconClick = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    if(window.innerWidth > 660){

    }
    
    function handleSubmit(event) {
        event.preventDefault();

        const query = event.target.elements.search.value.replace(/\s+/g, '+');

        if (searchType === "users") {
            navigate(`/search?user=${query}`);
        } else {
            navigate(`/search?query=${query}`);
        }
    }

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

    async function selectSearch(){
        var filterOptions = document.getElementById('option-conf-search-back');
        filterOptions.style.display = "block";
        setTimeout(function () {
            var checkedM = document.getElementById(`moviesL`);
            if (checkedM) {
                handleRadioButtonChange()
            }
        }, 100);
    }

    async function closeOptions(){
        var filterOptions = document.getElementById('option-conf-search-back');
        filterOptions.style.display = "block";
        if(filterOptions.style.display === "block"){
            filterOptions.style.display = 'none';
        }
    }

    var galop = document.getElementById('content-notification');
    if (galop) {
        galop.style.backgroundColor = 'rgba(255, 255, 255, 0)'
        galop.style.display = 'none'
    }
    async function notificationNow() {
        galop.style.backgroundColor = 'rgba(255, 255, 255)'
        if (galop.style.display === "block") {
            galop.style.display = 'none';
        }
        else if (galop.style.display === "none") {
            galop.style.display = 'block';
        }
    }

    useEffect(() => {
        axios.get("https://api.npoint.io/cbc695f77c7ff5dac3d1")
            .then(response => {
                setNotifications(response.data.notifications);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);
      

    return (
        <>
            <header className={isSearchOpen ? 'header-open' : ''}>
                <div className={isSearchOpen ? 'div-open' : ''}>
                    <Link to="/">
                        <img
                            className={isSearchOpen ? 'img-open' : ''}
                            src={logo} alt="Logo do site"
                        />
                    </Link>
                    <form
                        onSubmit={handleSubmit}
                        className={isSearchOpen ? 'form-close' : 'form-open'}
                    >
                        <FaSearch
                            color="black"
                            className="search-icon"
                            onClick={handleSearchIconClick}
                        />
                        {isSearchOpen && (
                            <>
                                <input
                                    className={isSearchOpen ? 'input-open' : ''}
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
                            </>
                        )}
                    </form>
                    <div className="ntf-cation-mobile" onClick={notificationNow}>
                        <MdNotifications className="notification-mobile" />
                        <div className="ntf-number">3</div>
                    </div>
                    <div id="content-notification" className="content-notification-mobile">
                        <MdArrowBack className="back-notification" onClick={notificationNow}/>
                        {notifications.map((notification) => (
                            <div key={notification.idPost} className="nofitify-content-inside-mobile">
                                <FragmentDetailsNotification 
                                        idMovie={notification.idMovie} 
                                        userName={notification.userName}
                                        action={notification.action}
                                        />
                            </div>
                        ))}
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;
