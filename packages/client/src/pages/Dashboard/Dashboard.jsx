import TableUsers from "../../components/TableUsers/TableUsers.jsx";
import {Card} from "@mantine/core";
import './Dashboard.scss';

export default function Dashboard() {

  return (
    <div>
        <h1>Dashboard</h1>
        <Card shadow="sm" padding="md" radius="md" className={"user-table"}>
            <TableUsers />
        </Card>
    </div>
  );
}