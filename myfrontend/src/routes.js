import {
    Route,
    BrowserRouter,
    Routes,
    Navigate
} from 'react-router-dom';

import Login from './pages/login';
import Home from './pages/home';
import Signup from './pages/signup';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token');

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
                    element={<PrivateRoute> <Home /> </PrivateRoute>}
                />
                <Route 
                    path="/login" 
                    element={<Login />} 
                />
                <Route 
                    path="/signup" 
                    element={<Signup />} 
                />
            </Routes>
        </BrowserRouter>
    )
}