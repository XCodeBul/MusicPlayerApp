import { Routes, Route, useNavigate } from "react-router-dom";
import Player from "../Player/Player.jsx";
import AppLayout from "../AppLayout/AppLayout.jsx";
import HomePage from "../HomePage/HomePage.jsx";
import Login from "../Auth/Login/Login.jsx"; 

const Router = () => {
    const navigate = useNavigate();

    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route index element={<HomePage />} />
                <Route path="player" element={<Player />} />
                <Route path="login" element={<Login isOpen={true} onClose={() => navigate('/')} />} />
            </Route>
        </Routes>
    );
};

export default Router;