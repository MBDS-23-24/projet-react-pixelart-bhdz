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
        updateProfile(values);
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
