import React, { useState, useEffect } from "react";
import axios from 'axios';
import styles from './styles.css';

import Publication from "../../components/Publication";

const Home = () => {
    return (
        <>
            <div className="social-page">
                <div className="social-section left-section">

                </div>
                <div className="social-section center-section">
                    <Publication />
                </div>
                <div className="social-section right-section">

                </div>
            </div>
        </>
    )
}

export default Home;






















// </form>


{/* Aqui você pode exibir a lista de publicações */ }
