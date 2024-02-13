// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { Avatar, Button, Paper, TextInput, Title, Text } from '@mantine/core';
import { UserContext } from '../../provider/UserContext.jsx';
//import './Settings.scss';

export default function Settings() {
    const { user } = useContext(UserContext);

    // Link to the user's profile image
    user.profileImageUrl = "https://picsum.photos/200/300";

    return (
        <div className="settings-container">
            <Title order={2} className="mantine-h2">
                Modify your account information
            </Title>
            <Paper className="mantine-paper" radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
                <Avatar src={user.profileImageUrl} size={120} radius={120} mx="auto" />
                <Title order={1} className="mantine-h1" mt="md">
                    {user.username}
                </Title>
                <Text className="mantine-text" mt="sm">
                    {user.email}
                </Text>

                <div className="settings-card">
                    <TextInput
                        className="mantine-input"
                        label="Username"
                        placeholder="Enter your new username"
                        fullWidth
                    />
                    <TextInput
                        className="mantine-input"
                        label="Email"
                        placeholder="Enter your new email"
                        type="email"
                        fullWidth
                    />
                    <TextInput
                        className="mantine-input"
                        label="Password"
                        placeholder="Enter your new password"
                        type="password"
                        fullWidth
                    />
                    <Button className="mantine-button" variant="outline" fullWidth mt="md">
                        Update Profile
                    </Button>
                    <Button className="mantine-button" variant="filled" color="red" fullWidth mt="sm">
                        Delete Account
                    </Button>
                </div>
            </Paper>
        </div>
    );
}
