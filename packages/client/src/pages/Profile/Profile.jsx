import { Avatar, Button, Card, Grid, TextInput, PasswordInput, Group, Text, Title, Paper, useMantineTheme } from '@mantine/core';
import { useContext } from "react";
import { UserContext } from "../../provider/UserContext.jsx";

export default function Profile() {
    const { user } = useContext(UserContext);
    // Theme
    const theme = useMantineTheme();
    // Link to the user's profile image
    user.profileImageUrl = "https://picsum.photos/200/300";

    // Styles
    const cardStyle = {
        maxWidth: '400px',
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center',
       // marginTop: '1rem'
    };
    const lastOnlineStyle = {
        color: theme.colors.blue[6],
        fontWeight: 550,
        marginTop: '1rem',
        fontSize: theme.fontSizes.sm,
        letterSpacing: '0.5px',
    };

    return (
        // Profile Page
        <Paper padding="md" style={{ background: theme.colors.gray[10], borderRadius: theme.radius.md }}>
            <Grid>
                <Grid.Col span={12} md={6} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Card shadow="xl" padding="md" style={cardStyle}>
                        <Avatar src={user.profileImageUrl} size={120} radius="xl" mx="auto" />
                        <Text size="lg" weight={300} mt="md">{user.username}</Text>
                        <Text size="sm" color="dimmed">{user.email}</Text>
                        <Text style={lastOnlineStyle}>Last Online: 3 hours ago</Text>
                    </Card>
                </Grid.Col>
                 {/* Account modification */}
                <Grid.Col span={12} md={6} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Card shadow="xl" padding="lg" style={cardStyle}>
                        <Title order={4} mb="md">Modify your account information</Title>
                        <TextInput label="Username" placeholder="Enter your new username" defaultValue={user.username} />
                        <TextInput label="Email" placeholder="Enter your new email" type="email" defaultValue={user.email} mt="md" />
                        <PasswordInput label="Password" placeholder="Enter your new password" mt="md" />
                        <Group position="right" mt="md">
                            <Button color="green">Update Profile</Button>
                            <Button color="red" variant="outline">Delete Account</Button>
                        </Group>
                    </Card>
                </Grid.Col>
            </Grid>
        </Paper>
    );
}