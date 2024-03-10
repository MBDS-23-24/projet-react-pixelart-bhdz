import Home from "./Home/Home.jsx";
import PixelBoard from "./PixelBoard/PixelBoard.jsx";
import Account from "./Account/Account.jsx";
import Dashboard from "./Dashboard/Dashboard.jsx";

const routes = [
    {name: 'Page D\'accueil', path: '/', element: <Home/>},
    {name: 'Pixel Board', path: '/pixel-board/:id', element: <PixelBoard/>},
    {name: 'Account', path: '/account', element: <Account/>},
    {name: "Dashboard", path: "/dashboard", element: <Dashboard />},
];

export default routes