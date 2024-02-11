import Home from "./Home/Home.jsx";
import Login from "./Login/Login.jsx";

const routes = [
    { name: 'Page D\'accueil',path: '/', element: <Home/> },
    { name: 'Login', path: '/login', element: <Login/> }
];

export default routes