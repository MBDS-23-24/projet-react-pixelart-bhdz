import React, { useContext } from 'react';
import { Title, Text, Button } from "@mantine/core";
import { UserContext } from "../../provider/UserContext.jsx";
//import { Background } from "./Background.jsx";
import './Profile.scss';
import GenericProfileSvg from './GenericProfileSvg.jsx';
import { IconUser, IconMailFilled, IconEdit } from "@tabler/icons-react";

export default function Profile() {
    const { user, setUser } = useContext(UserContext);
    // Données statiques à afficher dans le profil
    const staticData = {
        username: "Yehoudi",
        email: "vincentyehoudi@example.com",
    };

    return (
        <div className="profile">
            {/* {<Background />} */}
            <div className="card">
                <div>
                    <Title order={3} className={"b-600"}>
                        {staticData.username}'s Profile
                    </Title>
                    <Text className={"b-300"} size="sm" color="dimmed">
                        Your profile information
                    </Text>
                </div>
                <div className="profile-info">
                    <GenericProfileSvg />
                    <div className="profile-field">
                        <IconUser size={24} />
                        <Text>{staticData.username}</Text>
                    </div>
                    <div className="profile-field">
                        <IconMailFilled size={24} />
                        <Text>{staticData.email}</Text>
                    </div>
                </div>

                <Button fullWidth>
                    <IconEdit size={18} style={{ marginRight: 8 }} />
                    Update Profile
                </Button>
            </div>
        </div>
    );
}
