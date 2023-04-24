import react from 'react';
import {Route, BrowserRouter, Routes} from 'react-router-dom';

import Home from './pages/home';
import Login from './pages/login';
import SignUp from './pages/sign-up'

export default function Router(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/sign-up" element={<SignUp />}/>
            </Routes>
        </BrowserRouter>
    )
}