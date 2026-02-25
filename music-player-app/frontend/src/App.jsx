import {BrowserRouter} from "react-router-dom";
import Router from "./components/Router/Router.jsx";
import "./index.css";
import {AuthUserProvider} from "./contexts/AuthUserContext.jsx";
import {PlaylistProvider} from "./contexts/PlaylistContext.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <AuthUserProvider>
                <PlaylistProvider>
                    <Router/>
                </PlaylistProvider>
            </AuthUserProvider>
        </BrowserRouter>
    )
}

export default App
