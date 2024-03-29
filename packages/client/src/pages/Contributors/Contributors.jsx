import './Contributors.scss';
import {useEffect, useState} from "react";
import {useMutation} from "react-query";
import {getContributors} from "../../functions/backend_functions/user_backend_functions.js";
import {
    Button,
    Card,
    Container,
    Grid,
    Group,
    LoadingOverlay,
    Paper,
    Table,
    Title
} from "@mantine/core";
import {IconInfoCircle} from "@tabler/icons-react";
import {Link} from "react-router-dom";

export default function Contributors() {
    const [contributors, setContributors] = useState(null);

    const fetchContributors = useMutation(() => getContributors(), {
        onSuccess: (result) => {
            setContributors(result);
        },
    });

    useEffect(() => {
        fetchContributors.mutate();
    }, []);


    const rows = () => {
        if (contributors) {
            return contributors.map((contributor) => (
                <Table.Tr key={contributor.id}>
                    <Table.Td>{contributor.username}</Table.Td>
                    <Table.Td style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Link to={`/profile/${contributor.id}`}>
                            <Button endIcon={<IconInfoCircle size={14} />}>Show profile</Button>
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
                {contributors != null && (
                    <Grid gutter="md">
                        <Grid.Col span={12}>
                            <Paper padding="lg">
                                <LoadingOverlay
                                    visible={contributors === null}
                                    zIndex={1000}
                                    overlayProps={{radius: "sm", blur: 2}}/>


                                <Title order={1}>All Contributors</Title>

                                <div className={'contributions'}>

                                    <Card withBorder radius="md">
                                        <Group justify="space-between">

                                            <div className={'pixelboard-tables'}>


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

                                    </Card>



                                </div>


                            </Paper>
                        </Grid.Col>
                    </Grid>
                )}
            </div>

        </Container>
    );

}
