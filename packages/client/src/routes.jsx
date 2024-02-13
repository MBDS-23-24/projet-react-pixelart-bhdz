import Home from "./pages/Home/Home.jsx";
import Profile from "./pages/Profile/Profile.jsx";  
import PixelGrid from "./components/pixel-grid/PixelGrid.jsx";

const routes = [
    {name: 'Page D\'accueil', path: '/', element: <Home/>},
    {
        name: 'Temporary Pixel Board',
        path: '/pixel-board',
        element: <PixelGrid width={30} height={30} color="#9f35a5"/>
    },
    {
        name: 'Profile',
        path: '/profile',
        element: <Profile/> 
    }
];

export default routes