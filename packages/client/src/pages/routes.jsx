import Home from "./Home/Home.jsx";
import Profile from "./Profile/Profile.jsx";
import Settings from "./Settings/Settings.jsx";
import PixelGrid from "../components/pixel-grid/PixelGrid.jsx";

const routes = [
    { name: 'Page D\'accueil',path: '/', element: <Home/> },
    {name: 'Temporary Pixel Board', path: '/pixel-board', element: <PixelGrid width={30} height={30} color="#9f35a5"/>},
    {name: 'Profile', path: '/profile', element: <Profile/>},
    {name: 'Settings', path: '/settings', element: <Settings/>},
];

export default routes