import React, { useState, useEffect } from "react";
import './styles.css';
import { AiFillPlusCircle } from 'react-icons/ai';
import { FaSpinner } from 'react-icons/fa';

import axios from "axios";
import api from '../../api';

import ImageUpload from "../ImageUpload";
import { FaCheck } from 'react-icons/fa';

import StarRating from "../StarRating";

import { debounce } from 'lodash';

import { ToastContainer, toast } from 'react-toastify';

const Publication = (props) => {

    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState('');
    const [postText, setPostText] = useState('');
    const [selectedReview, setSelectedReview] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [minLoadingTimePassed, setMinLoadingTimePassed] = useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [user, setUser] = useState(null);

    function handleReviewChange(rating) {
        setSelectedReview(rating);
    }

    useEffect(() => {
        setSelectedMovie(props.selectedMovie)
    }, [])

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        let errorMsg = [];

        if ((document.getElementById("review-text").value).length < 10) {
            errorMsg.push("A crítica precisa ter mais de 10 caracteres")
        }

        if (selectedMovie === '') {
            errorMsg.push("O filme precisa ser selecionado")
        }

        if (selectedReview === '') {
            errorMsg.push("A nota precisa ser selecionada")
        }

        if (errorMsg.length > 0) {
            const concatenatedMessage = errorMsg.join('\n');

            toast.error(concatenatedMessage, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }

        let id = localStorage.getItem("idUser");
        id = id.substring(1, id.length - 1);
        let token = localStorage.getItem("tokenUser");
        token = token.substring(1, token.length - 1);

        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString();

        const data = {
            "review": selectedReview,
            "pub_text": postText,
            "user_id": parseInt(id),
            "date": formattedDate,
            "movie_id": selectedMovie.id,
            "movie_title": selectedMovie.original_title,
        };

        const formData = new FormData();

        setIsLoading(true);

        formData.append('image', selectedFile);
        formData.append('review', data.review);
        formData.append('pub_text', data.pub_text);
        formData.append('user_id', data.user_id);
        formData.append('date', data.date);
        formData.append('movie_id', data.movie_id);
        formData.append('movie_title', data.movie_title);

        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' };

        try {
            const response = await api.post('/publicacoes/', formData, { headers });
            console.log(response.data);

            setMinLoadingTimePassed(false);

            await delay(2000);

            setMinLoadingTimePassed(true);

            setIsLoading(false);
            setShowConfirmation(true);

            await delay(2000);

            setShowConfirmation(false);
        } catch (error) {
            console.log(error);
        }
        window.location.reload();
    };

    // function handle(event, movie) {
    //     setSelectedMovie(movie);

    //     handleMovieSelect(event)
    // }

    return (
        <>
            <ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <div className="publication-content-modal">

                {(isLoading || !minLoadingTimePassed) ? (
                    <div className="loading-overlay">
                        <div className="loading-indicator"></div>
                    </div>
                ) : showConfirmation ? (
                    <div className="confirmation-overlay">
                        <div className="confirmation-icon">
                            <FaCheck size={32} color="green" />
                        </div>
                    </div>
                ) : null}

                <div className="publication-text-content">
                    <textarea
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        placeholder="Escrever uma Crítica"
                        id="review-text"
                        maxLength={400}
                    />
                </div>

                <div
                    id="align-post-review-modal"
                    className="align-post-review-modal"
                >
                    <ImageUpload
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                    />

                    <div className="post-review-conf">
                        <StarRating
                            selectedRating={selectedReview}
                            onChange={handleReviewChange}
                        />
                        <button
                            style={{ maxWidth: "140px" }}
                            id="button-handleSubmit"
                            type="button"
                            onClick={handleSubmit}
                        >
                            Publicar Crítica
                        </button>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Publication;