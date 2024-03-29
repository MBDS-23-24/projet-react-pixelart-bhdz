import Home from "./Home/Home.jsx";
import PixelBoard from "./PixelBoard/PixelBoard.jsx";
import Account from "./Account/Account.jsx";
import Profile from "./Profile/Profile.jsx";
import Contributors from "./Contributors/Contributors.jsx";

const routes = [
    {name: 'Page D\'accueil', path: '/', element: <Home/>},
    {name: 'Pixel Board', path: '/pixel-board/:id', element: <PixelBoard/>},
    {name: 'Account', path: '/account', element: <Account/>},
    {name: 'Profile', path: '/profile/:userId', element: <Profile/>},
    {name: 'Contributors', path: 'contributors', element: <Contributors/>}
];

export default routes