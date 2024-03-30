import {useContext, useEffect} from "react";
import {UserContext} from "../../provider/UserContext.jsx";
import {Avatar, Badge, Button, Card, Divider, Group, Space, Switch, Text, Title, Tooltip} from "@mantine/core";
import {IconLink, IconUser} from "@tabler/icons-react";
import './ListCardsPixelBoard.scss';
import {
    formatedDateTime, getStatePixelBoard, isPixelBoardComingSoon
} from "../../pages/utils/Utils.js";
import NestedUsersAvatar from "../NestedUsersAvatar/NestedUsersAvatar.jsx";

export default function ListCardsPixelBoard ({pixelboards,navigateToBoard}) {
    const {user} = useContext(UserContext);

    const setColor = (pixelboard) => {
        let state = getStatePixelBoard(pixelboard)
        if (state === "Online") {
            return "green"
        } else if (state === "Closed") {
            return "red"
        } else if (state === "Coming soon") {
            return "indigo"
        }
        return "blue"
    }

    const convertMsToSeconds = (ms) => {
        return Math.floor(ms / 1000)
    }

    return <div className={"list-pixelboard"}>
        {pixelboards.map((pixelBoard, index) =>
            <Card key={index} shadow="sm" padding="xs" radius="lg" className={"card-pixelboard"} withBorder>
                <Title component="h3">
                    {pixelBoard.title}
                </Title>
                <Group justify="space-between" mt="md" mb="xs">
                    <Text fw={500}>Status:</Text>
                    <Badge color={setColor(pixelBoard)}>{ getStatePixelBoard(pixelBoard)}</Badge>
                </Group>

                <Group justify="space-between" mt="md" mb="xs">
                    <Text fw={500}> Date: </Text>
                    <Badge color="blue">{formatedDateTime(pixelBoard.startDate)}</Badge> - <Badge color="red">{formatedDateTime(pixelBoard.endDate)}</Badge>
                </Group>
                <Group justify="space-between" mt="md" mb="xs">
                    <Text fw={500}>Participants: </Text>
                    {pixelBoard.participants.length > 0 ? <NestedUsersAvatar users={pixelBoard.participants} /> : "Aucun"}
                </Group>
                <Divider />
                <Space mt="md" />
                <Group justify="space-between">
                    <Text>Size : [{pixelBoard.pixelWidth}, {pixelBoard.pixelHeight}]</Text>
                    <Text>Delay : {convertMsToSeconds(pixelBoard.delayMs)}s</Text>
                    <Group><Tooltip label={"If this parameter is active, then you can place a pixel on top of another pixel that has already been placed."}><Text>Override : </Text></Tooltip><Switch checked={pixelBoard.isPixelOverwrite} disabled/></Group>
                </Group>
                <Group justify="flex-around">
                    <Button
                        color="green"
                        mt="md" radius="md"
                        rightSection={<IconUser size={14} /> }>
                        Subscribe to this board
                    </Button>
                    {isPixelBoardComingSoon(pixelBoard) ? "": <Button
                        color="blue"
                        mt="md" radius="md"
                        variant='light'
                        rightSection={<IconLink size={14}/>}
                        onClick={() =>navigateToBoard(`/pixel-board/${pixelBoard.id}`)}
                    >
                        View the board
                    </Button>}
                </Group>
            </Card>
        )}
    </div>
}