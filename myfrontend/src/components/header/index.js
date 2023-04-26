import React, { useState } from "react";
import './styles.css';

import { FaSearch } from 'react-icons/fa';

import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';

import logo from '../../assets/logotype.png'

const Header = () => {

    const navigate = useNavigate();

    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const handleSearchIconClick = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    function handleSubmit(event) {
        event.preventDefault();

        const query = event.target.elements.search.value.replace(/\s+/g, '+'); 

        navigate(`/search?query=${query}`);
    }

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
                            <input
                                className={isSearchOpen ? 'input-open' : ''}
                                type="text"
                                placeholder="Pesquisar filmes"
                                name="search"
                            />
                        )}
                    </form>
                </div>
            </header>
        </>
    )
}

export default Header;