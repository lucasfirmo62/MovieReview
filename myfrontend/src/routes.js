import {Route, BrowserRouter, Routes} from 'react-router-dom';

import Profile from './pages/profile'

export default function Router(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/profile" element={<Profile />}/>
            </Routes>
        </BrowserRouter>
    )
}
