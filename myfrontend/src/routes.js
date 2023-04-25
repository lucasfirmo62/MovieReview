import {Route, BrowserRouter, Routes} from 'react-router-dom';

import SignUp from './pages/sign-up'
import Login from './pages/login'
import Profile from './pages/profile'
import EditProfile from './pages/edit-profile'
import Search from './pages/search'
import Home from './pages/home'
import Movie from './pages/movie'

export default function Router(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/sign-up" element={<SignUp />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/search" element={<Search />}/>
                <Route path="/profile" element={<Profile />}/>
                <Route path="/edit-profile" element={<EditProfile />}/>
                <Route path="/movie/:id" element={<Movie />}/>
                <Route path="/" element={<Home />}/>
            </Routes>
        </BrowserRouter>
    )
}
