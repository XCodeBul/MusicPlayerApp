import {Routes, Route, useNavigate} from "react-router-dom";
import Player from "../Player/Player.jsx";
import AppLayout from "../AppLayout/AppLayout.jsx";
import HomePage from "../HomePage/HomePage.jsx";
import Login from "../Auth/Login/Login.jsx";
import {PATHS} from "../../config/paths.js";

const Router = () => {
    const navigate = useNavigate()

    return (
        <Routes>
            <Route element={<AppLayout/>}>
                <Route index element={<HomePage/>}/>

                <Route path={PATHS.player} element={<Player/>}/>

                <Route path={PATHS.login} element={
                    <Login isOpen={true} onClose={() => navigate(PATHS.home)}/>
                }/>
            </Route>

            <Route path="*" element={<>404</>}/> {/* TODO: Add error page 404 */}
        </Routes>
    )
}

export default Router
