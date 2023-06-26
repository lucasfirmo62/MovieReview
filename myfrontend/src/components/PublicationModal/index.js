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
    
    };

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