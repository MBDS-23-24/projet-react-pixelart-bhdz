import './Contributors.scss';
import {useState} from "react";
import {useQuery} from "react-query";
import {getContributors} from "../../functions/backend_functions/user_backend_functions.js";
import {
    Avatar,
    Button,
    Container,
    Grid,
    Group,
    LoadingOverlay,
    Paper, Space,
    Table,
    Title
} from "@mantine/core";
import {IconUserCircle} from "@tabler/icons-react";
import {Link} from "react-router-dom";

export default function Contributors() {
    const [contributors, setContributors] = useState(null);

    const {isLoading} = useQuery('contributors', () => getContributors(), {
        enabled: true,
        onSuccess: (result) => {
            setContributors(result);
        }
    });


    const rows = () => {
        if (contributors) {
            return contributors.map((contributor) => (
                <Table.Tr key={contributor.id}>
                    <Table.Td>
                        <div className={'user-avatar'}>
                            <Avatar src={'contributor.accountImageUrl'}/>
                            {contributor.username}


                        </div>
                    </Table.Td>
                    <Table.Td style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Link to={`/profile/${contributor.id}`}>
                            <Button leftSection={<IconUserCircle size={14}/>}>Show profile</Button>
                        </Link>
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
                <LoadingOverlay
                    visible={isLoading}
                    zIndex={1000}
                    overlayProps={{radius: "sm", blur: 2}}/>

                {!isLoading && (
                    <Grid gutter="md">
                        <Grid.Col span={12}>
                            <Paper padding="lg">


                                <Title order={1}>All Contributors</Title>

                                <div className={'contributions'}>
                                    <Group justify="space-between">
                                        <div className={'pixelboard-tables'}>

                                            <Space h={20}/>

                                            <Table.ScrollContainer minWidth={500}>
                                                <Table striped highlightOnHover withTableBorder
                                                       withColumnBorders>
                                                    <Table.Thead>
                                                        <Table.Tr>
                                                            <Table.Th>Contributor</Table.Th>
                                                            <Table.Th></Table.Th>
                                                        </Table.Tr>
                                                    </Table.Thead>
                                                    <Table.Tbody>{rows()}</Table.Tbody>
                                                </Table>
                                            </Table.ScrollContainer>


                                        </div>
                                    </Group>


                                </div>


                            </Paper>
                        </Grid.Col>
                    </Grid>
                )}
            </div>

        </Container>
    );

}
