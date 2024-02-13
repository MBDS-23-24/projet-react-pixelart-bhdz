import { Avatar, Text, Button, Paper } from '@mantine/core';
import { UserContext } from "../../provider/UserContext.jsx";
import { useContext } from "react";
import './Profile.scss';

export default function Profile() {
    const { user } = useContext(UserContext);
    // Link to the user's profile image
    user.profileImageUrl = "https://picsum.photos/200/300";

    return (
        <Paper className="profile-container" radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
            <Avatar
                className="avatar"
                src={user.profileImageUrl}
                size={120}
                radius={120}
                mx="auto"
            />
            <Text ta="center" fz="lg" fw={500} mt="md">
                {user.username}
            </Text>
            <Text ta="center" c="dimmed" fz="sm">
                {user.email}
            </Text>
            <div className="button-wrapper">
                <Button className="update-profile-button" variant="default" fullWidth mt="md">
                    Update Profile
                </Button>
            </div>
        </Paper>
    );
}
