import Home from "./Home/Home.jsx";
import PixelBoard from "./PixelBoard/PixelBoard.jsx";
// import Dashboard from "./dashboard/Dashboard.jsx";

const routes = [
    {name: 'Page D\'accueil', path: '/', element: <Home/>},
    {name: 'Pixel Board', path: '/pixel-board/:id', element: <PixelBoard/>},
    // {name: 'Dashboard', path: '/dashboard', element: <Dashboard />}
];

export default routes