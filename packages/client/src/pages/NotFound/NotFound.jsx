import {Button, Container, Group, Title, useMantineColorScheme} from "@mantine/core";
import {BackgroundImage404} from "./BackgroundImage404.jsx";
import './NotFound.scss'
import {useNavigate} from "react-router";

export default function NotFound(){
    const { colorScheme } = useMantineColorScheme()
    const navigate = useNavigate();


    function redirectToHome(){
        navigate("/", { replace: true });
    }

    return <Container className={"container"}>
        <div className={"inner"}>
            <BackgroundImage404 className={"image"} dark-mode={(colorScheme === "dark").toString()}/>
            <div className={"content"}>
                <Title className={"title"}>Nothing to see here</Title>
                <p className={"description"}>
                    Page you are trying to open does not exist. You may have mistyped the address, or the
                    page has been moved to another URL.
                </p>
                <Group justify="center">
                    <Button size="md" onClick={redirectToHome}>Take me back to home page</Button>
                </Group>
            </div>
        </div>
    </Container>
}