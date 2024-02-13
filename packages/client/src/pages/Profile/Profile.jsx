// import { Avatar, Text, Button, Paper } from '@mantine/core';
// import { UserContext } from "../../provider/UserContext.jsx";
// import { useContext } from "react";

//
// export default function Profile() {
//     const { user } = useContext(UserContext);
//     // Link to the user's profile image
//     user.profileImageUrl = "https://picsum.photos/200/300";
//
//     return (
//         <Paper className="profile-container" radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
//             <Avatar
//                 className="avatar"
//                 src={user.profileImageUrl}
//                 size={120}
//                 radius={120}
//                 mx="auto"
//             />
//             <Text ta="center" fz="lg" fw={500} mt="md">
//                 {user.username}
//             </Text>
//             <Text ta="center" c="dimmed" fz="sm">
//                 {user.email}
//             </Text>
//             <div className="button-wrapper">
//                 <Button className="update-profile-button" variant="default" fullWidth mt="md">
//                     Update Profile
//                 </Button>
//             </div>
//         </Paper>
//     );
// }


// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { Avatar, Button, Paper, TextInput, Title, Text, Grid } from '@mantine/core';
import { UserContext } from '../../provider/UserContext.jsx';
import './Profile.scss';
export default function Profile() {
    const { user } = useContext(UserContext);
    // Link to the user's profile image
    user.profileImageUrl = "https://picsum.photos/200/300";

    return (
        <Grid className="user-profile-container" gutter="lg">
            <Grid.Col span={6}>
                <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
                    <Avatar
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
                        <Button variant="default" fullWidth mt="md">
                            Update Profile
                        </Button>
                    </div>
                </Paper>
            </Grid.Col>

            <Grid.Col span={6}>
                <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
                    <Title order={2}>
                        Modify your account information
                    </Title>
                    <Avatar src={user.profileImageUrl} size={120} radius={120} mx="auto" />
                    <Title order={1} mt="md">
                        {user.username}
                    </Title>
                    <Text mt="sm" c="dimmed">
                        {user.email}
                    </Text>

                    <div className="settings-card">
                        <TextInput
                            label="Username"
                            placeholder="Enter your new username"
                            fullWidth
                        />
                        <TextInput
                            label="Email"
                            placeholder="Enter your new email"
                            type="email"
                            fullWidth
                        />
                        <TextInput
                            label="Password"
                            placeholder="Enter your new password"
                            type="password"
                            fullWidth
                        />
                        <Button variant="outline" fullWidth mt="md">
                            Update Profile
                        </Button>
                        <Button variant="filled" color="red" fullWidth mt="sm">
                            Delete Account
                        </Button>
                    </div>
                </Paper>
            </Grid.Col>
        </Grid>
    );
}
