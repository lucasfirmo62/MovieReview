import {
    Route,
    BrowserRouter,
    Routes,
} from 'react-router-dom';

import Login from './pages/login';
import Home from './pages/home';
import Signup from './pages/signup';
import Search from './pages/search';

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />
                <Route 
                    path="/login" 
                    element={<Login />} 
                />
                <Route 
                    path="/signup" 
                    element={<Signup />} 
                />
                <Route 
                    path="/signup" 
                    element={<Search />} 
                />
            </Routes>
        </BrowserRouter>
    )
}