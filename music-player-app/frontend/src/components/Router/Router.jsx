import {Routes, Route} from "react-router-dom";
import Player from "../Player/Player.jsx";
import AppLayout from "../AppLayout/AppLayout.jsx";

const Router = () => (
    <Routes>
        <Route element={<AppLayout/>}>
            <Route index element={<>Home</>} />

            <Route path={'player'} element={<Player/>} />
        </Route>
    </Routes>
)

export default Router
