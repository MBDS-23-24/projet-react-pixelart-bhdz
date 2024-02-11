import {Link} from "react-router-dom";

export default function Home() {
    return (
        <div>
            <h1>Page d'accueil</h1>
            <p>Bienvenue sur la page d'accueil de l'application.</p>
            <Link to="/pixel-board">Cliquer ici pour voir le Pixel Board</Link>
        </div>
    )
}