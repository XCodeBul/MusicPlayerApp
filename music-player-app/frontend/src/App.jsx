import {BrowserRouter} from "react-router-dom";
import Router from "./components/Router/Router.jsx";
import "./index.css";
import {AuthUserProvider} from "./contexts/AuthUserContext.jsx";
import {PlaylistProvider} from "./contexts/PlaylistContext.jsx";
import {PlayerProvider} from "./contexts/PlayerContext.jsx";
import {LocalizationProvider} from "./contexts/LocalizationContext.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <LocalizationProvider>
                <AuthUserProvider>
                    <PlayerProvider>
                        <PlaylistProvider>
                            <Router/>
                        </PlaylistProvider>
                    </PlayerProvider>
                </AuthUserProvider>
            </LocalizationProvider>
        </BrowserRouter>
    )
}

export default App
