import {Link} from "react-router-dom";
import {logoutUser} from "../../provider/UserContext.jsx";
import {Button} from "@mantine/core";
import "./Home.scss";

export default function Home() {

    return (
        <div className={"home-content"}>
            <h1>Home Page</h1>
            <p>Welcome to the Pixel Art App !</p>
            <Link to="/pixel-board/0000000024239c0fe5ab43a1">Click here to access the Pixel Board</Link>
            <Button variant="filled" color="red" onClick={()=> logoutUser()}>Log out</Button>
        </div>
    )
}