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
import Watchlist from './pages/watchlist';
import Publication from './pages/publication';
import Supercriticos from './pages/supercriticos';
import FilmReviews from './pages/FilmReviews';
import Notifications from './pages/notifications';
import FavoritosUsers from './pages/favoritosUsers';

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
                    path="/favoritos/:id" 
                    element={<PrivateRoute> <FavoritosUsers /> </PrivateRoute>}
                />
                <Route 
                    path="/followers/:id" 
                    element={<PrivateRoute> <Followers /> </PrivateRoute>}
                />
                <Route 
                    path="/following/:id" 
                    element={<PrivateRoute> <Following /> </PrivateRoute>}
                />
                <Route 
                    path="/watchlist/:id" 
                    element={<PrivateRoute> <Watchlist /> </PrivateRoute>}
                />
                <Route 
                    path="/reviews/:id" 
                    element={<PrivateRoute> <FilmReviews /> </PrivateRoute>}
                />
                 <Route 
                    path="/supercriticos/" 
                    element={<PrivateRoute> <Supercriticos /> </PrivateRoute>}
                />
                <Route 
                    path="/publication/:id" 
                    element={<PrivateRoute> <Publication /> </PrivateRoute>}
                />
                <Route 
                    path="/notifications/:id" 
                    element={<PrivateRoute> <Notifications /> </PrivateRoute>}
                />
            </Routes>
        </BrowserRouter>
    )
}
