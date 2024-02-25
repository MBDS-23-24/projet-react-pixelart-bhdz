import {Button, Card, Title, useMantineColorScheme} from "@mantine/core";
import {useState} from "react";
import "./PixelBoardMenu.scss";
import {IconHistory} from "@tabler/icons-react";
import {HistoryPopup} from "../HistoryPopup/HistoryPopup.jsx";

export default function PixelBoardMenu({pixelBoard}) {
    const {colorScheme} = useMantineColorScheme();
    const [open, setOpen] = useState(false);

    return (
        <div className={"menu-pixelboard"}>
            <Card className={"menu"} data={colorScheme}>
                <div className={"menu-title"}>
                    <Title order={2}>{pixelBoard.title}</Title>
                </div>
                <div className={"menu-options"}>
                    <Button leftSection={<IconHistory size={18} />} color="blue" size="sm" radius={"lg"} onClick={()=> setOpen(!open)}>History</Button>
                    <HistoryPopup pixelBoard={pixelBoard} open={open} onClose={() => setOpen(false)} />
                </div>
            </Card>
        </div>
    );
}