import {useContext, useEffect} from "react";
import {UserContext} from "../../provider/UserContext.jsx";
import {
    formatedDate,
    isPixelBoardClosed,
    isPixelBoardComingSoon,
    isPixelBoardStarted,
    numberPixelToDisplay
} from "../../pages/utils/utils.js";
import {Badge, Button, Card, Grid, Group, Text, Title} from "@mantine/core";
import {IconLink, IconUser} from "@tabler/icons-react";
import './ListCardsPixelBoard.scss';

export default function ListCardsPixelBoard ({pixelboards,navigateToBoard}) {
    const {user} = useContext(UserContext);

    console.log("updated", pixelboards)
    const setColor = (pixelboard) => {
        let color = 'blue';
        if (isPixelBoardComingSoon(pixelboard)) color = 'blue';
        if (isPixelBoardStarted(pixelboard)) color = 'green';
        if (isPixelBoardClosed(pixelboard)) color = 'red';
        return color
    }
    const setLabel = (pixelboard) => {
        let label = 'Coming soon';
        if (isPixelBoardComingSoon(pixelboard)) label = 'Coming soon';
        if (isPixelBoardStarted(pixelboard)) label = 'Online';
        if (isPixelBoardClosed(pixelboard)) label = 'Closed';
        return label;
    }

    useEffect(() => {
        console.log("pixelboards", pixelboards)
    }, [pixelboards])

    return <div className={"list-pixelboard"}>
        {pixelboards.map((pixelBoard, index) =>
            <Card key={index} shadow="sm" padding="xs" radius="lg" className={"card-pixelboard"} withBorder>
                <Title component="h3">
                    {pixelBoard.title}
                </Title>
                {console.log(pixelBoard)}
                <Group justify="space-between" mt="md" mb="xs">
                    <Text fw={500}>Status:</Text>
                    <Badge color={setColor(pixelBoard)}>{ setLabel(pixelBoard)}</Badge>
                </Group>

                <Group justify="space-between" mt="md" mb="xs">
                    <Text fw={500}> Date: </Text>
                    <Badge color={setColor(pixelBoard)}>{formatedDate(pixelBoard.startDate)}</Badge>
                </Group>
                <Group justify="flex-around">
                    <Button
                        color="green"
                        mt="md" radius="md"
                        rightSection={<IconUser size={14} /> }>
                        S'incrire à ce board
                    </Button>
                    {isPixelBoardComingSoon(pixelBoard) ? "": <Button
                        color="blue"
                        mt="md" radius="md"
                        variant='light'
                        rightSection={<IconLink size={14}/>}
                        onClick={() =>navigateToBoard(`/pixel-board/${pixelBoard.id}`)}
                    >
                        Voir le board
                    </Button>}
                </Group>
            </Card>
        )}
    </div>
}