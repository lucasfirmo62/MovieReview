import {
    Route,
    BrowserRouter,
    Routes,
    Navigate
} from 'react-router-dom';

import SignUp from './pages/sign-up';
import Login from './pages/login';
import Profile from './pages/profile';
import EditProfile from './pages/edit-profile';
import Search from './pages/search';
import Home from './pages/home';
import Movie from './pages/movie';
import User from './pages/user';
import Favoritos from './pages/favoritos';
import Followers from './pages/followers';
import Following from './pages/following';

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
                <Route
                    path="/"
                    element={<PrivateRoute><Home /> </PrivateRoute>}
                />
                <Route 
                    path="/search" 
                    element={<PrivateRoute><Search /></PrivateRoute>}
                />
                <Route 
                    path="/login" 
                    element={<Login />} 
                />
                <Route 
                    path="/sign-up" 
                    element={<SignUp />} 
                />
                <Route 
                    path="/movie/:id" 
                    element={<PrivateRoute> <Movie /> </PrivateRoute>} 
                />
                <Route 
                    path="/profile" 
                    element={<PrivateRoute> <Profile /> </PrivateRoute>}
                />
                <Route 
                    path="/edit-profile" 
                    element={<PrivateRoute> <EditProfile /> </PrivateRoute>}
                />
                
                <Route
                    path="/user/:id"
                    element={<PrivateRoute> <User/> </PrivateRoute>}
                />
                <Route 
                    path="/favoritos" 
                    element={<PrivateRoute> <Favoritos /> </PrivateRoute>}
                />
                <Route 
                    path="/followers" 
                    element={<PrivateRoute> <Followers /> </PrivateRoute>}
                />
                <Route 
                    path="/following" 
                    element={<PrivateRoute> <Following /> </PrivateRoute>}
                />
            </Routes>
        </BrowserRouter>
    )
}
