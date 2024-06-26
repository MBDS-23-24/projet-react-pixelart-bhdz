import {useContext, useState} from 'react';
import { useForm } from '@mantine/form';
import { useMutation } from 'react-query';
import { updateUserAccount, changeUserPassword } from "../../functions/backend_functions/user_backend_functions.js";
import {logoutUser, updateUserContext, UserContext} from "../../provider/UserContext.jsx";
import {
    Button,
    TextInput,
    Group,
    Title,
    Paper,
    Text,
    Avatar,
    Grid,
    Card,
    Modal,
    PasswordInput,
    ActionIcon
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import './Account.scss';
import { useDisclosure } from "@mantine/hooks";
import {IconEdit} from "@tabler/icons-react";

export default function Account() {
    const { user, setUser } = useContext(UserContext);
    const [opened, { open, close }] = useDisclosure(false);

    const [hiddenEditAvatar, setHiddenEditAvatar] = useState(true);

    const form = useForm({
        initialValues: {
            accountImageUrl: user.accountImageUrl || '',
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
            confirmNewPassword: (value, values) =>
                value !== values.newPassword ? 'Passwords do not match' : null,
        },
    });

    const { mutate: updateAccount } = useMutation(updateUserAccount, {
        onSuccess: (data) => {
            setUser(data);
            updateUserContext(data);
            showNotification({
                title: 'Success',
                message: 'Account updated successfully',
                color: 'green',
            });

        },
        onError: (error) => {
            showNotification({
                title: 'Error',
                message: error?.response?.data?.message || 'Failed to update account',
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
        updateAccount(values);
    };

    const handleAccountFormSubmit = (e) => {
        e.preventDefault();
        form.onSubmit(onSubmit)(e);
    };

    const handlePasswordFormSubmit = (e) => {
        e.preventDefault();
        changePasswordForm.onSubmit(onSubmitChangePassword)(e);
    };

    const onClickEditAvatar = () => {
        setHiddenEditAvatar(!hiddenEditAvatar);
    }

    return (
        <div>
            <form onSubmit={handleAccountFormSubmit}>
                <Paper padding="md" className="account-paper">
                    <Grid>
                        <Grid.Col span={12} md={6} className="account-grid-col">
                            <Card shadow="xl" padding="md" className="account-card">
                                <div className={"avatar-container"}>
                                    <div className={"img"}>
                                        <Avatar src={user.accountImageUrl} size={120} radius="lg" className="account-avatar" />
                                        <ActionIcon size="lg" className="account-edit-avatar-button" onClick={onClickEditAvatar}>
                                            <IconEdit size={20} />
                                        </ActionIcon>
                                    </div>
                                    <div className={"container-form-avatar " + (hiddenEditAvatar ? "hidden" : "")}>
                                        <TextInput label="Avatar URL"
                                                   {...form.getInputProps('accountImageUrl')}
                                                   className="account-text-input"
                                                   placeholder="New Avatar URL" />
                                        <Button type="submit" color="green" className="account-update-avatar-button">Update Avatar</Button>
                                    </div>
                                </div>

                                <Text size="lg" weight={300} mt="md" className="account-text-lg">{user.username}</Text>
                                <Text size="sm" className="account-text-sm" color="dimmed">{user.email}</Text>
                            </Card>
                        </Grid.Col>

                        <Grid.Col span={12} md={6} className="account-grid-col">
                            <Card shadow="xl" padding="lg" className="account-card">
                                <Title order={4} mb="md" className="accoun-title">Modify your account information</Title>
                                <TextInput label="Username" {...form.getInputProps('username')} className="account-text-input" placeholder="New Username" />
                                <TextInput label="Email" {...form.getInputProps('email')} className="account-text-input" mt="md" placeholder="New E-mail" />
                                 <Button mt={20} type="submit" color="green" className="account-update-button">Update Account</Button>
                                <Title order={5} mt="lg" className="account-subtitle">Advanced Options</Title>
                                <Button onClick={open} mt="md">Change Password</Button>
                            </Card>
                        </Grid.Col>
                    </Grid>
                </Paper>
            </form>

            <Modal
                opened={opened}
                onClose={close}
                centered
                title="Change password"
            >
                <form onSubmit={handlePasswordFormSubmit}>
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
                        <Button type="button" variant="default" onClick={close}>Cancel</Button>
                        <Button type="submit" color="green">Save</Button>
                    </Group>
                </form>
            </Modal>
        </div>
    );
}
