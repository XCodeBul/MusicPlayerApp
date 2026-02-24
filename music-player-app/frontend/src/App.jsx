import {BrowserRouter} from "react-router-dom";
import Router from "./components/Router/Router.jsx";
import "./index.css";

const App = () => {
    return (
        <BrowserRouter>
            <Router/>
        </BrowserRouter>
    )
}

export default App
