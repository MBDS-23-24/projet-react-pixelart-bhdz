import {Link} from "react-router-dom";
import {logoutUser, UserContext} from "../../provider/UserContext.jsx";
import {Button} from "@mantine/core";

export default function Home() {

    return (
        <div>
            <h1>Page d'accueil</h1>
            <p>Bienvenue sur la page d'accueil de l'application.</p>
            <Link to="/pixel-board">Cliquer ici pour voir le Pixel Board</Link>
            <Button variant="filled" color="red" onClick={()=> logoutUser()}>Deconnexion</Button>
        </div>
    )
}