import {ActionIcon, Checkbox, Flex, ScrollArea, Space, Title} from "@mantine/core";
import {
    Button,
    Center,
    Group, rem,
    Table,
    TextInput,
    UnstyledButton,
    Text
} from "@mantine/core";
import {
    IconCheck,
    IconEdit, IconPlus,
    IconTrash
} from "@tabler/icons-react";
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons-react';
import {useContext, useState} from "react";
import {modals} from "@mantine/modals";
import './TablePixelBoard.scss';
import {useMutation, useQuery, useQueryClient} from "react-query";
import {
    delelePixelBoard,
    getAllPixelBoards,
} from "../../functions/backend_functions/pixelboard_backend_functions.js";
import {notifications} from "@mantine/notifications";
import FormAddAndEditPixelBoard from "../FormAddAndEditPixelBoard/FormAddAndEditPixelBoard.jsx";
import {UserContext} from "../../provider/UserContext.jsx";
import {formatedDateTime} from "../../pages/utils/Utils.js";

function Th({ children, reversed, sorted, onSort }) {
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
        <Table.Th>
            <UnstyledButton onClick={onSort} className={"control"}>
                <Group justify="center">
                    <Text fw={500} fz="sm" style={{fontWeight: 'bold'}}>
                        {children}
                    </Text>
                    <Center className={"icon"}>
                        <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    </Center>
                </Group>
            </UnstyledButton>
        </Table.Th>
    );
}
export default function TablePixelBoard() {
    const queryClient = useQueryClient()
    const {user} = useContext(UserContext);
    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState([]);
    const [sortBy, setSortBy] = useState(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [ pixels, setPixels] = useState([]);

    useQuery('pixels', () => getAllPixelBoards(), {
        enabled: true,
        onSuccess: data => {
            setPixels(data);
            setSortedData(data);
        },
        onError: error => {
            console.error("Error fetching pixels:", error);
        }
    })

    const deletePixelBoard = useMutation(delelePixelBoard, {
        onSuccess: () => {
            notifications.show({
                title: "Successfully deleted",
                message: `The pixel board is deleted`,
                color: "green",
                icon: <IconCheck size={24} />,
            });
            modals.closeAll();
            queryClient.invalidateQueries('pixels');
        },
        onError: error => {
            console.error("Error deleting pixel:", error);
        }
    });

    function refreshPixel() {
        queryClient.invalidateQueries('pixels');
    }

    const openDelete = (id) => modals.openConfirmModal({
        title: "Delete Pixel Board",
        centered: true,
        children: (
            <Text size='sm'>
                Are you sure you want to delete this pixel board ?
            </Text>
        ),
        labels: {confirm: "Delete", cancel: "Cancel"},
        confirmProps: {color: 'red'},
        onCancel: () => modals.closeAll(),
        onConfirm: () => deletePixelBoard.mutate(id)
    })

    function filterData(data, search) {
        const query = search.toLowerCase().trim();
        return data.filter((item) =>{
                return item.title.toString().toLowerCase().includes(query) || item.startDate.toString().toLowerCase().includes(query) || item.endDate.toString().toLowerCase().includes(query)
            }
        );
    }

    function sortData(data, payload) {
        const { sortBy } = payload;
        if (!sortBy) {
            return filterData(data, payload.search);
        }

        return filterData(
            [...data].sort((a, b) => {
                if (payload.reversed) {
                    return b[sortBy].localeCompare(a[sortBy]);
                }

                return a[sortBy].localeCompare(b[sortBy]);
            }),
            payload.search
        );
    }

    const setSorting = (field) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setSortedData(sortData(pixels, { sortBy: field, reversed, search }));
    };

    const handleSearchChange = (event) => {
        const { value } = event.currentTarget;
        setSearch(value);
        setSortedData(sortData(pixels, { sortBy, reversed: reverseSortDirection, search: value }));
    };

    const rows = sortedData.map((row, index) => (
        <Table.Tr key={index}>
            <Table.Td>{row.title}</Table.Td>
            <Table.Td>{formatedDateTime(new Date(row.startDate))}</Table.Td>
            <Table.Td>{formatedDateTime(new Date(row.endDate))}</Table.Td>
            <Table.Td>{row.pixelWidth} pixel(s)</Table.Td>
            <Table.Td>{row.pixelHeight} pixel(s)</Table.Td>
            <Table.Td>
                <Checkbox
                    disabled
                    checked={row.isPixelOverwrite}
                    color={"blue"}
                    style={{ display: "flex", justifyContent: "center"}}
                />
            </Table.Td>
            <Table.Td>
                <div style={{display: "flex", alignItems: "center", justifyContent: 'center', padding: 10, gap:'20px'}}>
                    <ActionIcon variant="filled" size={"lg"} onClick={() =>
                        modals.open({
                            title: "Form to update Pixel Board",
                            labels: { confirm: "Save", cancel: "Cancel" },
                            children: <FormAddAndEditPixelBoard user={user} onCancel={() => modals.closeAll()} refreshPixels={refreshPixel} pixelBoard={row} formType={"update"} />,
                            withCloseButton: false,
                        })
                    } ><IconEdit size={20}  /></ActionIcon>
                    <ActionIcon size={"lg"} color='red' onClick={() => openDelete(row.id)}><IconTrash size={20} /></ActionIcon>
                </div>
            </Table.Td>
        </Table.Tr>
    ));

    return <>
        <Flex className={"container-title"}>
            <Title order={3} className={"title-table-pixels"}>Pixels Board dashboard management</Title>
        </Flex>
        <Space h={20} />
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <Group justify="space-between">
                <TextInput
                    placeholder="Search here by title or start date or end date"
                    leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                    value={search}
                    className={"search"}
                    onChange={handleSearchChange}
                />
                <Button className={"btn-add"} rightSection={<IconPlus size={20} />} onClick={() => modals.open({
                    title: "Form to add Pixel Board",
                    labels: { confirm: "Save", cancel: "Cancel" },
                    children: <FormAddAndEditPixelBoard user={user} onCancel={() => modals.closeAll()} refreshPixels={refreshPixel} formType={"add"} pixelBoard={undefined}/>,
                    withCloseButton: false,
                })
                } >Add Pixel Board</Button>
            </Group>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: 15}}>
                <ScrollArea w={"100%"}>
                    <Table horizontalSpacing="md" verticalSpacing="xs" miw={400} stickyHeader className={"table-pixelboard"}>
                        <Table.Thead>
                            <Table.Tr>
                                <Th
                                    sorted={sortBy === 'title'}
                                    reversed={reverseSortDirection}
                                    onSort={() => setSorting('title')}
                                >
                                    Title
                                </Th>
                                <Th
                                    sorted={sortBy === 'startDate'}
                                    reversed={reverseSortDirection}
                                    onSort={() => setSorting('startDate')}
                                >
                                    Start Date
                                </Th>
                                <Th
                                    sorted={sortBy === 'endDate'}
                                    reversed={reverseSortDirection}
                                    onSort={() => setSorting('endDate')}
                                >
                                    End Date
                                </Th>
                                <Table.Th>
                                    Width
                                </Table.Th>
                                <Table.Th>
                                    Height
                                </Table.Th>
                                <Table.Th>
                                    Override pixel
                                </Table.Th>
                                <Table.Th>
                                    Actions
                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {rows.length > 0 ? (
                                rows
                            ) : (
                                <Table.Tr>
                                    <Table.Td>
                                        <Text fw={500} ta="center">
                                            Nothing found
                                        </Text>
                                    </Table.Td>
                                </Table.Tr>
                            )}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </div>

        </div>
    </>
}