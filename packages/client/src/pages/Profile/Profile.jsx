import { useContext } from 'react';
import { Title, Text, Button } from "@mantine/core";
import { UserContext } from "../../provider/UserContext.jsx";
import './Profile.scss';
import { IconUser, IconMailFilled, IconEdit } from "@tabler/icons-react";

export default function Profile() {
    const { user } = useContext(UserContext);

    // Link to the user's profile image
    const profileImageUrl = "https://picsum.photos/200/300";

    return (
        <div className="profile">
            <div className="card">
                <div className="profile-header">
                    <img src={profileImageUrl} alt="Profile" className="profile-picture" />
                    <Title order={1} className="profile-username">
                        {user.username}
                    </Title>
                    <Text className="profile-email">
                        {user.email}
                    </Text>
                </div>
            </div>

            <div className="card">
                <div className="profile__section">
                    <IconUser size={18} style={{ marginRight: 8 }} />
                    <Text>
                        {user.username}
                    </Text>
                </div>
                <div className="profile__section">
                    <IconMailFilled size={18} style={{ marginRight: 8 }} />
                    <Text>
                        {user.email}
                    </Text>
                </div>
            </div>

            <div className="card">
                <Title order={3} className="b-600">
                    Update your profile
                </Title>
                <Text className="b-300" size="sm" color="dimmed">
                    Update your profile information
                </Text>
                <Button fullWidth>
                    <IconEdit size={18} style={{ marginRight: 8 }} />
                    Update Profile
                </Button>
            </div>
        </div>
    );
}
