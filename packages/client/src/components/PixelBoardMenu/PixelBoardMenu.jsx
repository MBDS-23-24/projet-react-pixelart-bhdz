import {Badge, Button, Card, Title, useMantineColorScheme} from "@mantine/core";
import {useState} from "react";
import "./PixelBoardMenu.scss";
import {IconHistory} from "@tabler/icons-react";
import {HistoryPopup} from "../HistoryPopup/HistoryPopup.jsx";
import NestedUsersAvatar from "../NestedUsersAvatar/NestedUsersAvatar.jsx";
import TimerCountDown from "../TimerCountDown/TimerCountDown.jsx";
import {getStatePixelBoard} from "../../pages/utils/Utils.js";

export default function PixelBoardMenu({pixelBoard, connectedUsers}) {
    const {colorScheme} = useMantineColorScheme();
    const [open, setOpen] = useState(false);

    return (
        <div className={"menu-pixelboard"}>
            <Card className={"menu"} data={colorScheme}>
                <div className={"menu-title"}>
                    <Title order={2}>{pixelBoard.title}</Title>
                </div>
                <div className={"menu-options"}>
                    <Button leftSection={<IconHistory size={18}/>} color="blue" size="sm" radius={"lg"}
                            onClick={() => setOpen(!open)}>History</Button>
                    <HistoryPopup pixelBoard={pixelBoard} open={open} onClose={() => setOpen(false)}/>
                </div>

                {connectedUsers.length > 0 && (
                    <NestedUsersAvatar users={connectedUsers} maxAvatarDisplayed={2}/>
                )}
            </Card>

            <div style={{marginTop:'10px', opacity: 0.7}}>
                <Badge
                    size="xl"
                    variant="gradient"
                    gradient={{from: 'red', to: 'grape', deg: 90}}
                >
                    <TimerCountDown startDate={pixelBoard.startDate} endDate={pixelBoard.endDate} state={getStatePixelBoard(pixelBoard)}/>
                </Badge>
            </div>
        </div>
    )
}