import React from 'react';
import { Title, Text } from "@mantine/core";
import { BackgroundIllustration } from "./Background.jsx";
import './Profile.scss';

const Profile = () => {
    return (
        <div className="profile">
            <BackgroundIllustration />
            <div className="card">
                <Title order={3} className={"b-600"}>User Profile</Title>
                <Text className={"b-300"} size="sm" color="dimmed">View your profile information</Text>
                {/* Ajout a faire */}
            </div>
        </div>
    );
}

export default Profile;
