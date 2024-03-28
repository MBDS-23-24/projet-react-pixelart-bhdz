import {
    ActionIcon,
    Avatar,
    Button,
    Flex,
    Modal,
    ScrollArea,
    Select,
    Space,
    Table,
    Text,
    TextInput,
    Title
} from "@mantine/core";
import {IconEdit, IconSearch} from "@tabler/icons-react";
import {useState} from "react";
import {HistoryHeaderCell} from "../HistoryPopup/HistoryPopup.jsx";
import './TableUsers.scss';
import {useForm} from "@mantine/form";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {getAllRoles, getAllUsers, updateUser} from "../../functions/backend_functions/user_backend_functions.js";
import {notifications} from "@mantine/notifications";
import {checkEmail} from "../../pages/utils/FormValidation.js";

export default function TableUsers() {
    const queryClient = useQueryClient()
    const [openedModalEdit, setOpenedModalEdit] = useState(false);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [dataUsersSorted, setDataUsersSorted] = useState([]);
    const [rolesList, setRolesList] = useState([]);

    const form = useForm({
        initialValues: {
            username: '',
            email: '',
            role: '',
            accountImageUrl: '',
        },
        validate: {
            email: (value) => (checkEmail(value) ? null : 'Invalid email address'),
            role: (value) => (value ? null : 'Role is required'),
            accountImageUrl: (value) => (value ? null : 'Avatar url is required'),
        }
    });

    useQuery('roles', getAllRoles, {
        onSuccess: (data) => {
            setRolesList(data);
        }
    });

    useQuery('users', ()=> getAllUsers(), {
        onSuccess: (data) => {
            setDataUsersSorted(data);
        }
    });

    const editUser = useMutation(updateUser, {
        onSuccess: () => {
            queryClient.invalidateQueries('users').then(() => {
                setOpenedModalEdit(false);
                notifications.show({
                    title: 'User updated',
                    message: 'User has been updated successfully',
                    color: 'teal',
                    icon: null,
                });
            });
        },
        onError: (error) => {
            console.log(error);
            notifications.show({
                title: 'Error',
                message: 'User has not been updated',
                color: 'red',
                icon: null,
            });
        }
    })

    function filterData(data, search) {
        const query = search.toLowerCase().trim();
        return data.filter((item) => {
            return (
                item.username.toLowerCase().includes(query) ||
                item.email.toLowerCase().includes(query) ||
                item.role.label.toLowerCase().includes(query)
            );
        });
    }

    function sortData(data, payload) {
        const { sortBy } = payload;

        if (!sortBy) {
            return filterData(data, payload.search);
        }

        return filterData(
            [...data].sort((a, b) => {
                if (sortBy === "role") {
                    if (payload.reversed) {
                        return b.role.label.localeCompare(a.role.label);
                    }
                    return a.role.label.localeCompare(b.role.label);
                }
                if (payload.reversed) {
                    return b[sortBy].localeCompare(a[sortBy]);
                }

                return a[sortBy].localeCompare(b[sortBy]);
            }),
            payload.search
        );
    }

    const clickEdit = (user) => {
        form.setFieldValue('username', user.username);
        form.setFieldValue('email', user.email);
        form.setFieldValue('role', user.role);
        form.setFieldValue('accountImageUrl', user.accountImageUrl);
        setOpenedModalEdit(true);
    }

    const handleEdit = () => {
        editUser.mutate(form.values);
    }

    const setSorting = (field) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setDataUsersSorted(sortData(dataUsersSorted, { sortBy: field, reversed, search }));
    };

    const handleSearchChange = (event) => {
        const { value } = event.currentTarget;
        setSearch(value);
        setDataUsersSorted(sortData(dataUsersSorted, { sortBy, reversed: reverseSortDirection, search: value }));
    };

    const rows = dataUsersSorted.map((row, index) => (
        <Table.Tr key={index}>
            <Table.Td className={"avatar"}><Avatar src={row.accountImageUrl} />{row.username}</Table.Td>
            <Table.Td>{row.email}</Table.Td>
            <Table.Td>{row.role.label}</Table.Td>
            <Table.Td>
                <ActionIcon size={30} variant="filled" color="blue" aria-label="Edit" onClick={()=>clickEdit(row)}>
                    <IconEdit width={20} height={20} />
                </ActionIcon>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            <Flex className={"container-title"}>
                <Title order={3} className={"title-table-users"}>Users table</Title>
            </Flex>
            <Space h={20} />
            <TextInput placeholder="Search by username, email, or role"
                       icon={<IconSearch />}
                       value={search}
                       onChange={handleSearchChange}/>
            <Space h={10} />
            <ScrollArea h={400}>
                <Table horizontalSpacing="md" verticalSpacing="xs" layout="fixed" stickyHeader>
                    <Table.Thead>
                        <Table.Tr className={"tr-users"}>
                            <HistoryHeaderCell
                                sorted={sortBy === 'username'}
                                reversed={reverseSortDirection}
                                onSort={() => setSorting('username')}
                            >
                                User
                            </HistoryHeaderCell>
                            <HistoryHeaderCell
                                sorted={sortBy === 'email'}
                                reversed={reverseSortDirection}
                                onSort={() => setSorting('email')}
                            >
                                Email
                            </HistoryHeaderCell>
                            <HistoryHeaderCell
                                sorted={sortBy === 'role'}
                                reversed={reverseSortDirection}
                                onSort={() => setSorting('role')}
                            >
                                Role
                            </HistoryHeaderCell>
                            <HistoryHeaderCell>
                                Actions
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
            <Modal opened={openedModalEdit} onClose={ () => setOpenedModalEdit(false) } title={"Edit user"}>
                <form onSubmit={form.onSubmit(handleEdit)}>
                    <TextInput
                        label="Avatar url"
                        placeholder="Enter avatar url"
                        required
                        {...form.getInputProps('accountImageUrl')}
                    />
                    <Space h={10}/>
                    <TextInput
                        label="Username"
                        placeholder="Enter username"
                        required
                        {...form.getInputProps('username')}
                    />
                    <Space h={10}/>
                    <TextInput
                        label="Email"
                        placeholder="Enter email"
                        required
                        {...form.getInputProps('email')}
                    />
                    <Space h={10}/>
                    <Select
                        label="Role"
                        placeholder="Enter role"
                        required
                        data={rolesList.map((role) => ({value: role.id, label: role.label}))}
                        {...form.getInputProps('role.id')}
                    />
                    <Space h={10}/>
                    <Flex className={"container-title"}>
                        <Button onClick={() => setOpenedModalEdit(false)} color="red">Cancel</Button>
                        <Button type="submit" color="teal">Edit</Button>
                    </Flex>
                </form>
            </Modal>
        </>
    )
}