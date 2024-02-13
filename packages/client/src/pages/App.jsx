import './App.css'
import {Route, Routes} from "react-router-dom";
import routes from "./routes.jsx";
import {useContext} from "react";
import {UserContext} from "../provider/UserContext.jsx";
import Login from "./Login/Login.jsx";
import {Notification} from "@mantine/core";
import {Notifications} from "@mantine/notifications";

function App() {
    const { user} = useContext(UserContext);

    return (
        <>
            <Notifications />
            {user ? (
                <Routes>
                    {routes.map((route, index) => (
                        <Route key={index} path={route.path} element={route.element} />
                    ))}
                </Routes>
            ) : (<Login />)}
        </>
    )
}

export default App
