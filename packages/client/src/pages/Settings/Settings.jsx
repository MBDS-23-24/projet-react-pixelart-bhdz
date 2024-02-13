// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Title, Text } from "@mantine/core";
import './Settings.scss';

const Settings = () => {
    return (
        <div className="settings">
            <div className="card">
                <Title order={3} className={"b-600"}>Account Settings</Title>
                <Text className={"b-300"} size="sm" color="dimmed">Modify your account information</Text>
                {/* Ajout a faire */}
            </div>
        </div>
    );
}

export default Settings;
