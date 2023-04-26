import {Route, BrowserRouter, Routes} from 'react-router-dom';

import SignUp from './pages/sign-up'
import Login from './pages/login'
import Profile from './pages/profile'
import EditProfile from './pages/edit-profile'
import Home from './pages/home'

const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('tokenUser');

    if (isAuthenticated) {
        return children
    }

    return <Navigate to="/login" />
}

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/sign-up" element={<SignUp />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/profile" element={<Profile />}/>
                <Route path="/edit-profile" element={<EditProfile />}/>
                <Route path="/" element={<Home />}/>
            </Routes>
        </BrowserRouter>
    )
}
