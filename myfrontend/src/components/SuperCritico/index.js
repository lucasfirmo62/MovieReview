import React, { useState, useEffect } from "react";
import './styles.css';
import { GoVerified } from 'react-icons/go';

const SuperCritico = () => {

    return (
        <>
            <p className="super-critic"><GoVerified className="verified" /> <div className="critic-name">S</div>uper<div className="critic-name">C</div>rítico</p>
        </>
    )
}

export default SuperCritico;






