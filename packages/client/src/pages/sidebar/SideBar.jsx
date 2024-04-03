import {Button, Stack} from "@mantine/core";


export const SideBar = () => {


    return (
        <Stack
            h={800}
            justify="center"
        >
            <Button variant="default">Add pixelBoard</Button>
            <Button variant="default">Manage pixelBoard</Button>
            <Button variant="default">Settings</Button>
        </Stack>
    );
}