import { useForm } from '@mantine/form';
import { useMutation } from "react-query";
import './Register.scss';
import { notifications } from "@mantine/notifications";
import { IconCheck, IconLock, IconMailFilled, IconUserCircle, IconUser } from "@tabler/icons-react";
import { Button, Text, TextInput } from "@mantine/core";
import { checkEmail, checkPassword, checkUsername } from "../utils/FormValidation.js";
import { registerUser } from "../../functions/backend_functions/user_backend_functions.js";

function Register({ onClose }) {
    const registerForm = useForm({
        initialValues: {
            username: '',
            email: '',
            password: '',
            accountImageUrl: '',
        },
        validate: {
            username: (value) => (checkUsername(value) ? null : 'Username is required'),
            email: (value) => (checkEmail(value) ? null : 'Invalid email address'),
            password: (value) => (checkPassword(value) ? null : 'Password is too short'),
        }
    });

    const registerUserMutation = useMutation(registerUser, {
        onSuccess: () => {
            notifications.show({
                title: 'Registration successful',
                message: 'You are now registered!',
                color: 'green',
                icon: <IconCheck size={24} />,
            });
            onClose();
        },
        onError: (error) => {
            console.error('Registration failed:', error);
            notifications.show({
                title: 'Registration failed',
                message: 'An error occurred during registration. Please try again later.',
                color: 'red',
            });
        }
    });

    const handleRegisterSubmit = (userData) => {
        registerUserMutation.mutate(userData);
    };

    return (
        <form onSubmit={registerForm.onSubmit(handleRegisterSubmit)} className="register-form">
            <div className="register-form__group">
                <Text className={'b-300'} size="sm" color="dimmed">
                    Create a new account
                </Text>
            </div>
            <div className="register-form__group">
                <TextInput
                    id="username"
                    placeholder={'Username'}
                    size="md"
                    leftSection={<IconUser size={24} />}
                    {...registerForm.getInputProps('username')}
                    required
                />
            </div>
            <div className="register-form__group">
                <TextInput
                    id="accountImageUrl"
                    placeholder={'Avatar URL'}
                    size="md"
                    leftSection={<IconUserCircle size={24} />}
                    {...registerForm.getInputProps('accountImageUrl')}
                />
            </div>
            <div className="register-form__group">
                <TextInput
                    id="email"
                    placeholder={'Email'}
                    size="md"
                    leftSection={<IconMailFilled size={24} />}
                    {...registerForm.getInputProps('email')}
                    required
                />
            </div>
            <div className="register-form__group">
                <TextInput
                    id="password"
                    type="password"
                    placeholder={'Password'}
                    size="md"
                    leftSection={<IconLock size={24} />}
                    {...registerForm.getInputProps('password')}
                    required
                />
            </div>
            <div className="register-form__group">
                <Button fullWidth type="submit">
                    Register
                </Button>
            </div>
        </form>

    );
}

export default Register;
