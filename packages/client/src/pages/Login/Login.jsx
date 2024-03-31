import {useContext, useState} from "react";
import { useForm } from '@mantine/form';
import {useMutation} from "react-query";
import {UserContext} from "../../provider/UserContext.jsx";
import {loginUser, registerUser} from "../../functions/backend_functions/user_backend_functions.js";
import BackgroundIllustration from "./BackgroundIllustration.jsx";
import './Login.scss';
import {IconCheck, IconLock, IconMailFilled, IconUser} from "@tabler/icons-react";
import {Button, Modal, Text, TextInput, Title, useMantineColorScheme} from "@mantine/core";
import {notifications} from "@mantine/notifications";
import {checkEmail, checkPassword, checkUsername} from "../utils/FormValidation.js";

export default function Login() {
    const {colorScheme} = useMantineColorScheme();
    const {setUser} = useContext(UserContext);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const form = useForm({
        initialValues: {
            email: "pierre.bihannic@pixelart.com",
            password: "PixelPass1!",
        },
        validate: {
            email: (value) => (checkEmail(value) ? null : 'Invalid email address'),
            password: (value) => (checkPassword(value) ? null : 'Password is too short'),
        }
    });

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

    const login = useMutation((user) => loginUser(user), {
        onSuccess: (data) => {
            setTimeout(() => {
                    setUser(data);
                    window.location.reload();
                }, 1000
            )
            notifications.show({
                title: "Successful connection",
                message: "You are now logged in !",
                color: "green",
                icon: <IconCheck size={24}/>,
            });
        },
    });

    const onSubmit = (data) => {
        login.mutate(data);
    }

    const registerUserMutation = useMutation(registerUser, {
        onSuccess: () => {
            notifications.show({
                title: 'Registration successful',
                message: 'You are now registered!',
                color: 'green',
                icon: <IconCheck size={24} />,
            });
            setShowRegisterModal(false);
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
        <div className={"login-container"}>
            <form onSubmit={form.onSubmit(onSubmit)} className="login">
                <BackgroundIllustration/>
                <div className={`card ${colorScheme === "light" ? "card-background-light" : "card-background-dark"}`}>
                    <div>
                        <Title order={3} className={"b-600"}>Log in</Title>
                        <Text className={"b-300"} size="sm" color="dimmed">Log in to your account</Text>
                    </div>
                    <TextInput id="email"
                               placeholder={"Email"}
                               size="md"
                               leftSection={
                                   <IconMailFilled size={24}
                                   />
                               }
                               {...form.getInputProps('email')}/>

                    <TextInput id="password"
                               type="password"
                               placeholder={"Password"}
                               size="md"
                               leftSection={
                                   <IconLock size={24}
                                   />
                               }
                               {...form.getInputProps('password')}/>
                    <Button fullWidth type="submit">Login</Button>
                    <Button fullWidth variant="filled" color="rgba(29, 104, 184, 1)"
                            onClick={() => setShowRegisterModal(true)}>
                        Register
                    </Button>
                </div>
            </form>

            <Modal
                opened={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                title="Register"
                size={'sm'}
                className={colorScheme === 'light' ? 'modal-content-light' : ''}
                centered>

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
                            leftSection={<IconUser size={24}/>}
                            {...registerForm.getInputProps('username')}
                        />
                    </div>
                    <div className="register-form__group">
                        <TextInput
                            id="accountImageUrl"
                            placeholder={'Avatar URL'}
                            size="md"
                            leftSection={<IconUser size={24}/>}
                            {...registerForm.getInputProps('accountImageUrl')}
                        />
                        </div>
                    <div className="register-form__group">
                        <TextInput
                            id="email"
                            placeholder={'Email'}
                            size="md"
                            leftSection={<IconMailFilled size={24}/>}
                            {...registerForm.getInputProps('email')}
                        />
                    </div>
                    <div className="register-form__group">
                        <TextInput
                            id="password"
                            type="password"
                            placeholder={'Password'}
                            size="md"
                            leftSection={<IconLock size={24}/>}
                            {...registerForm.getInputProps('password')}
                        />
                    </div>
                    <div className="register-form__group">
                        <Button fullWidth type="submit">
                            Register
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}