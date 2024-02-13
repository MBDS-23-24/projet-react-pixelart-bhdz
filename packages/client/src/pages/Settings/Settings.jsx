import React from 'react';
import { Title, Text } from "@mantine/core";
import { BackgroundIllustration } from "../Profile/Background.jsx";
import './Settings.scss';

const Settings = () => {
    return (
        <div className="settings">
            <BackgroundIllustration />
            <div className="card">
                <Title order={3} className={"b-600"}>Account Settings</Title>
                <Text className={"b-300"} size="sm" color="dimmed">Modify your account information</Text>
                {/* Ajout a faire */}
            </div>
        </div>
    );
}

export default Settings;
