import {Badge, Button, Card, Divider, Group, Space, Switch, Text, Title, Tooltip} from "@mantine/core";
import {IconLink} from "@tabler/icons-react";
import './ListCardsPixelBoard.scss';
import {
    formatedDateTime, getStatePixelBoard, isPixelBoardComingSoon
} from "../../pages/utils/Utils.js";
import NestedUsersAvatar from "../NestedUsersAvatar/NestedUsersAvatar.jsx";
import TimerCountDown from "../TimerCountDown/TimerCountDown.jsx";

export default function ListCardsPixelBoard ({pixelboards,navigateToBoard}) {

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

    function getBadgeColors(state) {
        if (state === "Online") {
            return "red"
        } else if (state === "Coming soon") {
            return "indigo"
        }
        return "blue"
    }

    return <div className={"list-pixelboard"}>
        {pixelboards.map((pixelBoard, index) =>
            <div key={index} className={"content-card"}>
                {getStatePixelBoard(pixelBoard) !== "Closed" && <Badge
                    size="lg"
                    className={"timer"}
                    variant="gradient"
                    gradient={{ from: getBadgeColors(getStatePixelBoard(pixelBoard)), to: 'grape', deg: 90 }}>
                    <TimerCountDown endDate={pixelBoard.endDate} state={getStatePixelBoard(pixelBoard)}/>
                </Badge>}
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
                        {pixelBoard.participants.length > 0 ? <NestedUsersAvatar users={pixelBoard.participants} /> : "None"}
                    </Group>
                    <Divider />
                    <Space mt="md" />
                    <Group justify="space-between">
                        <Text>Size : [{pixelBoard.pixelWidth}, {pixelBoard.pixelHeight}]</Text>
                        <Text>Delay : {convertMsToSeconds(pixelBoard.delayMs)}s</Text>
                        <Group><Tooltip label={"If this parameter is active, then you can place a pixel on top of another pixel that has already been placed."}><Text>Override pixel : </Text></Tooltip><Switch checked={pixelBoard.isPixelOverwrite} disabled/></Group>
                    </Group>
                    <Group justify="flex-around">
                        {isPixelBoardComingSoon(pixelBoard) ? "": <Button
                            color="blue"
                            mt="md" radius="md"
                            variant='light'
                            fullWidth
                            rightSection={<IconLink size={14}/>}
                            onClick={() =>navigateToBoard(`/pixel-board/${pixelBoard.id}`)}
                        >
                            Join the board
                        </Button>}
                    </Group>
                </Card>
            </div>
        )}
    </div>
}