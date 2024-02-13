import React from 'react';
import { Title, Text, Button } from "@mantine/core";
import { Background } from "./Background.jsx";
import './Profile.scss';
//import {IconCheck, IconLock, IconMailFilled} from "@tabler/icons-react";
//import {Button, Text, TextInput, Title} from "@mantine/core";
import GenericProfileSvg from './GenericProfileSvg.jsx';


export default function Profile() {
    const { user } = useContext(UserContext);
  
    return (
      <div className="profile">
        <Background />
        <div className="card">
          <div>
            <Title order={3} className={"b-600"}>
              {user.username}'s Profile
            </Title>
            <Text className={"b-300"} size="sm" color="dimmed">
              Your profile information
            </Text>
          </div>
          <div className="profile-info">
            <div className="profile-field">
              <IconUser size={24} />
              <Text>{user.username}</Text>
            </div>
            <div className="profile-field">
              <IconMailFilled size={24} />
              <Text>{user.email}</Text>
            </div>
            {/* Add more fields as needed for your user profile */}
          </div>
  
          <Button fullWidth>
            <IconEdit size={18} style={{ marginRight: 8 }} />
            Update Profile
          </Button>
        </div>
      </div>
    );
  }