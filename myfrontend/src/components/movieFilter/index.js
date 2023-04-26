import React, { useState } from "react";
import './styles.css'

const MovieFilter = ({ filterMovies }) => {
    const [genre, setGenre] = useState([]);
    const [year, setYear] = useState("");
    const [rating, setrating] = useState("");

    const handleFilterChange = (event) => {
        event.preventDefault();

        const genres = genre.join(",");
        filterMovies(year, genres, rating);
    };

    return (

        <form className="movie-filter-container" onSubmit={handleFilterChange}>
            <div>
                <label htmlFor="genre">Gênero:</label>
                <select
                    id="genre"
                    value={genre}
                    onChange={(e) => setGenre(Array.from(e.target.selectedOptions, option => option.value))}
                    multiple
                >
                    <option value="28">Ação</option>
                    <option value="16">Animação</option>
                    <option value="99">Documentário</option>
                    <option value="18">Drama</option>
                    <option value="10751">Família</option>
                    <option value="14">Fantasia</option>
                    <option value="36">História</option>
                    <option value="35">Comédia</option>
                    <option value="27">Horror</option>
                    <option value="10402">Música</option>
                    <option value="9648">Mistério</option>
                    <option value="10749">Romance</option>
                    <option value="878">Ficção científica</option>
                    <option value="53">Thriller</option>
                    <option value="10752">Guerra</option>
                    <option value="37">Faroeste</option>
                </select>
            </div>
            <div>
                <label htmlFor="rating">Avaliação:</label>
                <select
                    id="rating"
                    value={rating}
                    onChange={(e) => setrating(e.target.value)}
                >
                    <option value="">Selecione uma opção</option>
                    <option value="desc">Melhor avaliação</option>
                    <option value="asc">Pior avaliação</option>
                </select>
            </div>

            <div>
                <label htmlFor="year">Ano:</label>
                <input
                    className="input-year"
                    type="number"
                    id="year"
                    value={year}
                    placeholder="Digite o ano do filme"
                    onChange={(e) => setYear(e.target.value)}
                    min="1900"
                    max={new Date().getFullYear()} 
                />
            </div>

            <button type="submit">Filtrar</button>
        </form>

    );
};

export default MovieFilter;
