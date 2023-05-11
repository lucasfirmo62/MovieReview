import React, { useState, useEffect } from "react";
import './styles.css';

import { FaSearch } from 'react-icons/fa';

import { Link, useNavigate } from 'react-router-dom';

import logo from '../../assets/logotype.png'

const Header = () => {
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchType, setSearchType] = useState("movies");

    const handleSearchIconClick = () => {
        setIsSearchOpen(!isSearchOpen);
    
        setTimeout(function () {
            var checkedM = document.getElementById(`moviesL`);
            if (checkedM) {
                handleRadioButtonChange()
                checkedM.style.backgroundColor = "#D30069";
            }
        }, 100);
    };
    
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
            checkedElement.style.backgroundColor = "#D30069";
            console.log('ID do radio button marcado:', checkedId);
        }
    }

    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('change', handleRadioButtonChange);
    });

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
                                    placeholder="Pesquisar filmes"
                                    name="search"
                                />
                                <div className="option-conf-search-back">
                                    <label className="button-radio" id="moviesL">
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
                                    <label className="button-radio" id="usersL">
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
                </div>
            </header>
        </>
    )
}

export default Header;
