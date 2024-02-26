import Home from "./Home/Home.jsx";
import PixelBoard from "./PixelBoard/PixelBoard.jsx";
import Account from "./Account/Account.jsx";

const routes = [
    {name: 'Page D\'accueil', path: '/', element: <Home/>},
    {name: 'Pixel Board', path: '/pixel-board/:id', element: <PixelBoard/>},
    {name: 'Pixel Board', path: '/pixel-board/:id', element: <PixelBoard/>},
    {name: 'Account', path: '/account', element: <Account/>},
];

export default routes