import './App.scss'
import {Navigate, Route, Routes} from "react-router-dom";
import routes from "./routes.jsx";
import {useContext} from "react";
import {UserContext} from "../provider/UserContext.jsx";
import Login from "./Login/Login.jsx";
import {AppShell} from "@mantine/core";
import {Notifications} from "@mantine/notifications";
import {NavBar} from "../components/Navbar/Navbar.jsx";
import {hasRightToAccess} from "../utils/Utils.js";
import NotFound from "./NotFound/NotFound.jsx";

function App() {
    const {user} = useContext(UserContext);

    function getActiveLinkByUrl() {
        const url = window.location.pathname;
        return (url === "/" ? "Home" : url.substring(1).charAt(0).toUpperCase() + url.substring(2));
    }

    function displayRoute() {
        return routes.map((route, index) => {
            if (hasRightToAccess(user, route)) {
                return <Route key={index} path={route.path} element={route.element}/>;
            } else {
                return <Navigate key={index} to="/" replace/>;
            }
        });
    }

    return (
        <>
            <Notifications/>
            {user ? (
                <AppShell>
                    <AppShell.Navbar>
                        <NavBar active={getActiveLinkByUrl()}/>
                    </AppShell.Navbar>

                    <AppShell.Main>
                        <Routes>
                            {displayRoute()}
                            {routes.map((route, index) => (
                                <Route key={index} path={route.path} element={route.element}/>
                            ))}
                        </Routes>
                    </AppShell.Main>
                </AppShell>
            ) : (<Login/>)}
        </>
    )
}

export default App
