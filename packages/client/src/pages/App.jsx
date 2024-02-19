import './App.scss'
import {Route, Routes} from "react-router-dom";
import routes from "./routes.jsx";
import {useContext} from "react";
import {UserContext} from "../provider/UserContext.jsx";
import Login from "./Login/Login.jsx";
import {AppShell} from "@mantine/core";
import {Notifications} from "@mantine/notifications";
import {NavBar} from "../components/Navbar/Navbar.jsx";

function App() {
    const {user} = useContext(UserContext);

    function getActiveLinkByUrl() {
        const url = window.location.pathname;
        return (url === "/" ? "Home" : url.substring(1).charAt(0).toUpperCase() + url.substring(2));
    }

    return (
        <>
            <Notifications/>
            {user ? (
                <AppShell className="element-page">
                    <AppShell.Navbar>
                        <NavBar active={getActiveLinkByUrl()}/>
                    </AppShell.Navbar>
                    <AppShell.Main className={"content"}>
                        <Routes>
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
