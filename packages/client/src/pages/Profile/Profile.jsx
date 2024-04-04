import './Profile.scss';
import {useEffect, useState} from "react";
import {useMutation} from "react-query";
import {getUserContribution} from "../../functions/backend_functions/user_backend_functions.js";
import {useParams} from "react-router";
import {
    Avatar,
    Card,
    Container,
    Grid,
    Group,
    LoadingOverlay,
    Paper,
    Switch,
    Table,
    Title
} from "@mantine/core";

export default function Profile() {
    const {userId} = useParams();
    const [userContributions, setUserContributions] = useState(null);

    const fetchUserContribution = useMutation(() => getUserContribution(userId), {
        onSuccess: (result) => {
            setUserContributions(result);
        },
    });

    useEffect(() => {
        fetchUserContribution.mutate();
    }, [userId]);


    const rows = () => {
        if (userContributions && userContributions.pixelBoardsContributed) {
            return userContributions.pixelBoardsContributed.map((pixelBoard) => (
                <Table.Tr key={pixelBoard.id}>
                    <Table.Td>{pixelBoard.title}</Table.Td>
                    <Table.Td>{pixelBoard.pixelWidth} x {pixelBoard.pixelHeight} pixels</Table.Td>
                    <Table.Td>{pixelBoard.totalPixelUser} pixel(s)</Table.Td>
                    <Table.Td>
                        <Switch
                            checked={pixelBoard.isPixelOverwrite}
                            color="lime"
                            label={pixelBoard.isPixelOverwrite ? "Yes" : "No"}
                            disabled
                        />

                    </Table.Td>

                </Table.Tr>
            ));
        } else {
            return null;
        }
    };

    return (
        <Container size="sm">
            <div className={'profile-container'}>

                {userContributions != null && (

                    <Grid gutter="md">
                        <Grid.Col span={12}>
                            <Paper padding="lg">
                                <LoadingOverlay
                                    visible={userContributions === null}
                                    zIndex={1000}
                                    overlayProps={{radius: "sm", blur: 2}}/>


                                <div className={'header-container'}>

                                    <div className="profile-header">

                                    </div>

                                    <Avatar src={userContributions.user.accountImageUrl} size={120} radius="xl"
                                            className="account-avatar"/>
                                    <Title>
                                        {userContributions.user.username}
                                    </Title>
                                </div>

                                <div className={'contributions'}>

                                    <Card withBorder radius="md">
                                        <Group justify="space-between">
                                            <h4>Contributions ({userContributions.totalPixel} pixels drawn in
                                                total)</h4>
                                            <div className={'pixelboard-tables'}>
                                                {userContributions.totalPixel > 0 && (

                                                    <Table.ScrollContainer minWidth={500}>
                                                        <Table striped highlightOnHover withTableBorder
                                                               withColumnBorders>
                                                            <Table.Thead>
                                                                <Table.Tr>
                                                                    <Table.Th>PixelBoard</Table.Th>
                                                                    <Table.Th>Size</Table.Th>
                                                                    <Table.Th>Pixels drawn</Table.Th>
                                                                    <Table.Th>Overridden PixelBoard</Table.Th>
                                                                </Table.Tr>
                                                            </Table.Thead>
                                                            <Table.Tbody>{rows()}</Table.Tbody>
                                                        </Table>
                                                    </Table.ScrollContainer>
                                                )}


                                                {userContributions.totalPixel === 0 && (
                                                    <p>No contributions yet</p>
                                                )}
                                            </div>


                                        </Group>

                                    </Card>


                                    <div className={'pixelboard-footer'}>
                                        <small>Data can take up to 1 minute to update after drawing</small>

                                    </div>


                                </div>


                            </Paper>
                        </Grid.Col>
                    </Grid>
                )}
            </div>

        </Container>
    );

}
