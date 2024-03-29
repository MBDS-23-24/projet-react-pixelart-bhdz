import Home from "./Home/Home.jsx";
import PixelBoard from "./PixelBoard/PixelBoard.jsx";
import Account from "./Account/Account.jsx";
import Dashboard from "./Dashboard/Dashboard.jsx";
import Profile from "./Profile/Profile.jsx";
import Contributors from "./Contributors/Contributors.jsx";

const routes = [
    {name: 'Page D\'accueil', path: '/', element: <Home/>, needAccess: false},
    {name: 'Pixel Board', path: '/pixel-board/:id', element: <PixelBoard/>, needAccess: false},
    {name: 'Account', path: '/account', element: <Account/>, needAccess: false},
    {name: "Dashboard", path: "/dashboard", element: <Dashboard />, needAccess: true},
    {name: 'Profile', path: '/profile/:userId', element: <Profile/>, needAccess: false},
    {name: 'Contributors', path: 'contributors', element: <Contributors/>, needAccess: false}
];

export default routes