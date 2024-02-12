import {Link} from "react-router-dom";
import {logoutUser} from "../../provider/UserContext.jsx";
import {Button} from "@mantine/core";

export default function Home() {

    return (
        <div>
            <h1>Home Page</h1>
            <p>Welcome to the Pixel Art App !</p>
            <Link to="/pixel-board">Click here to access the Pixel Board</Link>
            <Button variant="filled" color="red" onClick={()=> logoutUser()}>Log out</Button>
        </div>
    )
}