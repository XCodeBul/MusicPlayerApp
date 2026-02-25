import {BrowserRouter} from "react-router-dom";
import Router from "./components/Router/Router.jsx";
import "./index.css";
import {AuthUserProvider} from "./contexts/AuthUserContext.jsx";
import {PlaylistProvider} from "./contexts/PlaylistContext.jsx";
import {PlayerProvider} from "./contexts/PlayerContext.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <AuthUserProvider>
                <PlayerProvider>
                    <PlaylistProvider>
                        <Router/>
                    </PlaylistProvider>
                </PlayerProvider>
            </AuthUserProvider>
        </BrowserRouter>
    )
}

export default App
