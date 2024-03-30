import { useState} from "react";
import {
    Avatar, Center, ColorSwatch,
    Divider, Group,
    Modal, ScrollArea, Space,
    Table, Text,
    TextInput, UnstyledButton,
} from "@mantine/core";
import {IconChevronDown, IconChevronUp, IconSearch, IconSelector} from "@tabler/icons-react";
import {useQuery} from "react-query";
import {getHistoryPixelsByBoardId} from "../../functions/backend_functions/pixelboard_backend_functions.js";
import './HistoryPopup.scss';
import {formatedDateCountDown, sortArrayByDate} from "../../pages/utils/Utils.js";

function HistoryHeaderCell({ children, reversed, sorted, onSort }) {
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
        <Table.Th className={"th"}>
            <UnstyledButton onClick={onSort} className={"control"}>
                <Group justify="space-between">
                    <Text fw={500} fz="sm">
                        {children}
                    </Text>
                    <Center className={"icon"}>
                        <Icon stroke={1.5} />
                    </Center>
                </Group>
            </UnstyledButton>
        </Table.Th>
    );
}

export function HistoryPopup({pixelBoard, open, onClose}) {
    const [search, setSearch] = useState('');
    const [dataHistorySorted, setDataHistorySorted] = useState([]);
    const [sortBy, setSortBy] = useState(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [dataHistory, setDataHistory] = useState([]);

    useQuery('history', ()=> getHistoryPixelsByBoardId(pixelBoard.id), {
        enabled: open,
        onSuccess: (data) => {
            const arraySorted = sortArrayByDate(data);
            setDataHistory(arraySorted);
            setDataHistorySorted(arraySorted)
        }
    });

    function filterData(data, search) {
        const query = search.toLowerCase().trim();
        return data.filter((item) => {
            return item.user.username.toLowerCase().trim().includes(query) || item.position.toString().includes(query) || item.color.toLowerCase().includes(query);
        });
    }

    function sortData(data, payload) {
        const { sortBy } = payload;

        if (!sortBy) {
            return filterData(data, payload.search);
        }

        return filterData(
            [...data].sort((a, b) => {
                if (sortBy === "username") {
                    if (payload.reversed) {
                        return b.user.username.localeCompare(a.user.username);
                    }
                    return a.user.username.localeCompare(b.user.username);
                }
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
        setDataHistorySorted(sortData(dataHistory, { sortBy: field, reversed, search }));
    };

    const handleSearchChange = (event) => {
        const { value } = event.currentTarget;
        setSearch(value);
        setDataHistorySorted(sortData(dataHistory, { sortBy, reversed: reverseSortDirection, search: value }));
    };

    const rows = dataHistorySorted.map((row, index) => (
        <Table.Tr key={index}>
            <Table.Td className={"avatar"}><Avatar src={"https://picsum.photos/200/300"} />{row.user.username}</Table.Td>
            <Table.Td>{row.position}</Table.Td>
            <Table.Td className={"avatar"}><ColorSwatch radius={"md"} color={row.color} />{row.color}</Table.Td>
            <Table.Td>{formatedDateCountDown(row.lastUpdate)}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Modal title="History" onClose={onClose} size="xl" opened={open}>
            <TextInput placeholder="Search by user, position, or color"
                       icon={<IconSearch />}
                       value={search}
                       onChange={handleSearchChange}/>
            <Space h={10} />
            <Divider />
            <Space h={10} />
            <ScrollArea h={400}>
                <Table horizontalSpacing="md" verticalSpacing="xs" layout="fixed" stickyHeader>
                    <Table.Thead>
                        <Table.Tr>
                            <HistoryHeaderCell
                                sorted={sortBy === 'username'}
                                reversed={reverseSortDirection}
                                onSort={() => setSorting('username')}
                            >
                                User
                            </HistoryHeaderCell>
                            <HistoryHeaderCell
                                sorted={sortBy === 'position'}
                                reversed={reverseSortDirection}
                                onSort={() => setSorting('position')}
                            >
                                Pixel position
                            </HistoryHeaderCell>
                            <HistoryHeaderCell
                                sorted={sortBy === 'color'}
                                reversed={reverseSortDirection}
                                onSort={() => setSorting('color')}
                            >
                                Color
                            </HistoryHeaderCell>
                            <HistoryHeaderCell
                                sorted={sortBy === 'lastUpdate'}
                                reversed={reverseSortDirection}
                                onSort={() => setSorting('lastUpdate')}
                            >
                                Date
                            </HistoryHeaderCell>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {rows.length > 0 ? (
                            rows
                        ) : (
                            <Table.Tr>
                                <Table.Td>
                                    <Text fw={500} ta="left">
                                        Nothing found
                                    </Text>
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </ScrollArea>
        </Modal>
    );
}