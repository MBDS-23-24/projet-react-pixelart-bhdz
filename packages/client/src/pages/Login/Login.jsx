import {useContext, useState} from "react";
import { useForm } from '@mantine/form';
import {useMutation} from "react-query";
import {UserContext} from "../../provider/UserContext.jsx";
import {loginUser} from "../../functions/backend_functions/user_backend_functions.js";
import BackgroundIllustration from "./BackgroundIllustration.jsx";
import './Login.scss';
import {IconCheck, IconLock, IconMailFilled} from "@tabler/icons-react";
import {Button, Modal, Text, TextInput, Title, useMantineColorScheme} from "@mantine/core";
import {notifications} from "@mantine/notifications";
import {checkEmail, checkPassword} from "../utils/FormValidation.js";
import Register from "../Register/Register.jsx";

export default function Login() {
    const {colorScheme} = useMantineColorScheme();
    const {setUser} = useContext(UserContext);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        },
        validate: {
            email: (value) => (checkEmail(value) ? null : 'Invalid email address'),
            password: (value) => (checkPassword(value) ? null : 'Password is too short'),
        }
    });

    const toggleRegisterModal = () => {
        setShowRegisterModal(!showRegisterModal);
    };


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
                    <Button fullWidth variant="filled" color="rgba(29, 104, 184, 1)" onClick={toggleRegisterModal}>
                        Register
                    </Button>
                </div>
            </form>
            <Modal
                opened={showRegisterModal}
                onClose={toggleRegisterModal}
                title="Register"
                size={'sm'}
                className={colorScheme === 'light' ? 'modal-content-light' : ''}
                centered>
                <Register onClose={toggleRegisterModal} />
            </Modal>
        </div>
    );
}