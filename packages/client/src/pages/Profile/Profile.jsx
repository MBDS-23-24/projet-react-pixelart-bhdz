// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from 'react';
import { useForm } from '@mantine/form';
import { useMutation } from 'react-query';
import { updateUser, changeUserPassword } from "../../functions/backend_functions/user_backend_functions.js";
import { logoutUser, UserContext } from "../../provider/UserContext.jsx";
import {Button, TextInput, Group, Title, Paper, Text, Avatar, Grid, Card, Modal, PasswordInput} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import './Profile.scss';
import {useDisclosure} from "@mantine/hooks";

export default function Profile() {
    const { user, setUser } = useContext(UserContext);
    //Link to user's profile
    user.profileImageUrl = "https://picsum.photos/200/300";
    const [opened,{open, close}] = useDisclosure(false);

    const form = useForm({
        initialValues: {
            username: user.username || '',
            email: user.email || '',
        },
    });

    const changePasswordForm = useForm({
        initialValues: {
            newPassword: '',
            confirmNewPassword: '',
        },
        validate: {
            newPassword: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
            confirmNewPassword: (value, values) => value !== values.newPassword ? 'Passwords do not match' : null,
        },
    });

    const { mutate: updateProfile } = useMutation(updateUser, {
        onSuccess: (data) => {
            setUser(data);
            showNotification({
                title: 'Success',
                message: 'Profile updated successfully',
                color: 'green',
            });
        },
        onError: (error) => {
            showNotification({
                title: 'Error',
                message: error?.response?.data?.message || 'Failed to update profile',
                color: 'red',
            });
        },
    });

    const changePasswordMutation = useMutation(changeUserPassword, {
        onSuccess: () => {
            showNotification({
                title: 'Password Changed',
                message: 'Your password has been changed successfully. Please log in again.',
                color: 'green',
            });
            open();
            logoutUser();
        },
        onError: (error) => {
            showNotification({
                title: 'Failed to Change Password',
                message: error?.response?.data?.message || 'An error occurred while trying to change the password.',
                color: 'red',
            });
        }
    });

    const onSubmitChangePassword = (values) => {
        if (values.newPassword === values.confirmNewPassword) {
            changePasswordMutation.mutate({
                userId: user.id,
                newPassword: values.newPassword,
            });
        }
    };

    const onSubmit = (values) => {
        updateProfile(values);
    };

    return (
        <form onSubmit={form.onSubmit(onSubmit)}>
            <Paper padding="md" className="profile-paper">
                <Grid>
                    <Grid.Col span={12} md={6} className="profile-grid-col">
                        <Card shadow="xl" padding="md" className="profile-card">
                            <Avatar src={user.profileImageUrl} size={120} radius="xl" className="profile-avatar" />
                            <Text size="lg" weight={300} mt="md" className="profile-text-lg">{user.username}</Text>
                            <Text size="sm" className="profile-text-sm" color="dimmed">{user.email}</Text>
                        </Card>
                    </Grid.Col>

                    <Grid.Col span={12} md={6} className="profile-grid-col">
                        <Card shadow="xl" padding="lg" className="profile-card">
                            <Title order={4} mb="md" className="profile-title">Modify your account information</Title>
                            <TextInput label="Username" {...form.getInputProps('username')} className="profile-text-input" placeholder="New Username" />
                            <TextInput label="Email" {...form.getInputProps('email')} className="profile-text-input" mt="md" placeholder="New E-mail" />
                            <Group position="right" mt="md">
                                <Button type="submit" color="green" className="profile-update-button">Update Profile</Button>
                            </Group>
                            <Title order={5} mt="lg" className="profile-subtitle">Advanced Options</Title>
                            <Button onClick={open} mt="md">Change Password</Button>
                        </Card>
                    </Grid.Col>
                </Grid>
            </Paper>

            <Modal
                opened={opened}
                onClose={close}
                centered
                title="Change password"
            >
                <form onSubmit={changePasswordForm.onSubmit(onSubmitChangePassword)}>
                    <PasswordInput
                        label="New password"
                        placeholder="Enter new password"
                        {...changePasswordForm.getInputProps('newPassword')}
                        required
                    />
                    <PasswordInput
                        label="Confirm new password"
                        placeholder="Confirm new password"
                        {...changePasswordForm.getInputProps('confirmNewPassword')}
                        mt="md"
                        required
                    />
                    <Group position="right" mt="md">
                        <Button variant="default" onClick={close}>Cancel</Button>
                        <Button type="submit" color="green">Save</Button>
                    </Group>
                </form>
            </Modal>
        </form>
    );
}