import TableUsers from "../../components/TableUsers/TableUsers.jsx";
import {Card, rem, Tabs} from "@mantine/core";
import './Dashboard.scss';
import {IconMessageCircle, IconPencil, IconPhoto, IconSettings, IconUser} from "@tabler/icons-react";
import TablePixelBoard from "../../components/TablePixelBoard/TablePixelBoard.jsx";

export default function Dashboard() {

    return (
        <div style={{margin: 20}}>
            <h1>Dashboard</h1>
            <Tabs defaultValue="pixelboard" classNames={"tab"} style={{marginLeft: 100, marginRight: 100}}>
                <Tabs.List grow>
                    <Tabs.Tab
                        value="pixelboard"
                        leftSection={<IconPencil style={{width: rem(16), height: rem(16)}}/>}
                        style={{width: 80}}
                    >
                        Pixel Board
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="user"
                        leftSection={<IconUser style={{width: rem(16), height: rem(16)}}/>}
                    >
                        User
                    </Tabs.Tab>
                </Tabs.List>
               <div style={{marginTop: 10}}>
                   <Tabs.Panel  value="user">
                       <Card shadow="sm" padding="md" radius="md" className={"user-table"}>
                           <TableUsers />
                       </Card>
                   </Tabs.Panel>
               </div>
                <div style={{marginTop: 10}}>
                    <Tabs.Panel  value="pixelboard">
                        <Card shadow="sm" padding="md" radius="md" className={"pixel-board-table"}>
                            <TablePixelBoard />
                        </Card>
                    </Tabs.Panel>
                </div>
            </Tabs>
        </div>
    );
}