// // eslint-disable-next-line no-unused-vars
// import React, { useContext, useState } from 'react';
// import { Avatar, Button, Card, Grid, TextInput, PasswordInput, Group, Text, Title, Paper, useMantineTheme } from '@mantine/core';
// import { showNotification } from '@mantine/notifications';
// import { UserContext } from '../../provider/UserContext.jsx';
//
// export default function Profile() {
//     const { user, setUser } = useContext(UserContext);
//     const theme = useMantineTheme();
//     // Link to the user's profile image
//     user.profileImageUrl = "https://picsum.photos/200/300";
//
//
//     const [username, setUsername] = useState(user.username);
//     const [email, setEmail] = useState(user.email);
//     const [password, setPassword] = useState('');
//
//     // Styles
//     const cardStyle = {
//         maxWidth: '400px',
//         marginLeft: 'auto',
//         marginRight: 'auto',
//         textAlign: 'center',
//     };
//     const lastOnlineStyle = {
//         color: theme.colors.blue[6],
//         fontWeight: 550,
//         marginTop: '1rem',
//         fontSize: theme.fontSizes.sm,
//         letterSpacing: '0.5px',
//     };
//
//     // update user profile
//     const handleUpdateProfile = async () => {
//         const response = await fetch('/user/update', {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 id: user.id,
//                 username,
//                 email,
//                 password,
//             }),
//         });
//
//         if (response.ok) {
//             const updatedUser = await response.json();
//             setUser(updatedUser);
//             showNotification({ title: 'Success', message: 'Profile updated successfully', color: 'green' });
//         } else {
//             showNotification({ title: 'Error', message: 'Failed to update profile', color: 'red' });
//         }
//     };
//
//     // delete user account
//     const handleDeleteAccount = async () => {
//         const response = await fetch('/user/delete', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 id: user.id,
//             }),
//         });
//
//         if (response.ok) {
//             // log user out
//             showNotification({ title: 'Account Deleted', message: 'Your account has been successfully deleted.', color: 'green' });
//         } else {
//             showNotification({ title: 'Error', message: 'Failed to delete account', color: 'red' });
//         }
//     };
//
//     return (
//         <Paper padding="md" style={{ background: theme.colors.gray[10], borderRadius: theme.radius.md }}>
//             <Grid>
//                 <Grid.Col span={12} md={6} style={{ display: 'flex', justifyContent: 'center' }}>
//                     <Card shadow="xl" padding="md" style={cardStyle}>
//                         <Avatar src={user.profileImageUrl} size={120} radius="xl" mx="auto" />
//                         <Text size="lg" weight={300} mt="md">{user.username}</Text>
//                         <Text size="sm" color="dimmed">{user.email}</Text>
//                         <Text style={lastOnlineStyle}>Last Online: 3 hours ago</Text>
//                     </Card>
//                 </Grid.Col>
//
//                 <Grid.Col span={12} md={6} style={{ display: 'flex', justifyContent: 'center' }}>
//                     <Card shadow="xl" padding="lg" style={cardStyle}>
//                         <Title order={4} mb="md">Modify your account information</Title>
//                         <TextInput label="Username" placeholder="Enter your new username" value={username} onChange={(e) => setUsername(e.target.value)} />
//                         <TextInput label="Email" placeholder="Enter your new email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} mt="md" />
//                         <PasswordInput label="Password" placeholder="Enter your new password" value={password} onChange={(e) => setPassword(e.target.value)} mt="md" />
//                         <Group position="right" mt="md">
//                             <Button color="green" onClick={handleUpdateProfile}>Update Profile</Button>
//                             <Button color="red" variant="outline" onClick={handleDeleteAccount}>Delete Account</Button>
//                         </Group>
//                     </Card>
//                 </Grid.Col>
//             </Grid>
//         </Paper>
//     );
// }
// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { useForm } from '@mantine/form';
import { useMutation } from 'react-query';
import { updateUser } from "../../functions/backend_functions/user_backend_functions.js";
import { UserContext } from "../../provider/UserContext.jsx";
import { Button, TextInput, PasswordInput, Group, Title, Paper, Text, Avatar, Grid, Card, useMantineTheme } from '@mantine/core';
import { showNotification } from '@mantine/notifications';

export default function Profile() {
    const { user, setUser } = useContext(UserContext);
    const theme = useMantineTheme();
    // Link to the user's profile image
    user.profileImageUrl = "https://picsum.photos/200/300";
    const form = useForm({
        initialValues: {
            username: user.username || '',
            email: user.email || '',
            password: '', //Can be empty
        },
    });

    const { mutate: updateProfile} = useMutation(updateUser, {
        onSuccess: (data) => {
            setUser(data);
            showNotification({
                title: 'Success',
                message: 'Profile updated successfully',
                color: 'green',
            });
        },
        onError: (error) => {
            showNotification({
                title: 'Error',
                message: error?.response?.data?.message || 'Failed to update profile',
                color: 'red',
            });
        },
    });

    const onSubmit = (values) => {
        updateProfile({ ...values, id: user.id });
    };

    return (
        <form onSubmit={form.onSubmit(onSubmit)}>
            <Paper padding="md" style={{ background: theme.colors.gray[10], borderRadius: theme.radius.md }}>
                <Grid>
                    <Grid.Col span={12} md={6} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Card shadow="xl" padding="md" style={{ maxWidth: '400px', width: '100%', margin: 'auto', textAlign: 'center' }}>
                            <Avatar src={user.profileImageUrl} size={120} radius="xl" mx="auto" />
                            <Text size="lg" weight={300} mt="md">{user.username}</Text>
                            <Text size="sm" color="dimmed">{user.email}</Text>
                        </Card>
                    </Grid.Col>

                    <Grid.Col span={12} md={6} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Card shadow="xl" padding="lg" style={{ maxWidth: '400px', width: '100%', margin: 'auto' }}>
                            <Title order={4} mb="md">Modify your account information</Title>
                            <TextInput label="Username" {...form.getInputProps('username')} />
                            <TextInput label="Email" {...form.getInputProps('email')} mt="md" />
                            <PasswordInput label="Password" {...form.getInputProps('password')} mt="md" />
                            <Group position="right" mt="md">
                                <Button type="submit" color="green">Update Profile</Button>
                            </Group>
                        </Card>
                    </Grid.Col>
                </Grid>
            </Paper>
        </form>
    );
}
