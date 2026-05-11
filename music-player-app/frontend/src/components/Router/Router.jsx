import {Routes, Route, useNavigate} from "react-router-dom";
import Player from "../Player/Player.jsx";
import AppLayout from "../AppLayout/AppLayout.jsx";
import HomePage from "../HomePage/HomePage.jsx";
import Login from "../Auth/Login/Login.jsx";
import {PATHS} from "../../config/paths.js";

const Router = () => {
    // Хук за програмна навигация между маршрутите
    const navigate = useNavigate()

    return (
        <Routes>
            {/* Обгръщащ Layout, който съдържа общите елементи на приложението */}
            <Route element={<AppLayout/>}>
                {/* Начална страница (index) */}
                <Route index element={<HomePage/>}/>

                {/* Маршрут за музикалния плеър */}
                <Route path={PATHS.player} element={<Player/>}/>

                {/* Маршрут за вход - отваря модален прозорец и пренасочва при затваряне */}
                <Route path={PATHS.login} element={
                    <Login isOpen={true} onClose={() => navigate(PATHS.home)}/>
                }/>
            </Route>

            {/* fallback за несъществуващи страници (404 Error) */}
            <Route path="*" element={<>404</>}/>
        </Routes>
    )
}

export default Router
