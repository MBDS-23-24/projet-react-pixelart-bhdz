import {useContext, useEffect} from "react";
import { useForm } from '@mantine/form';
import {useMutation} from "react-query";
import {UserContext} from "../../provider/UserContext.jsx";
import {loginUser} from "../../functions/backend_functions/user_backend_functions.js";
import BackgroundIllustration from "./BackgroundIllustration.jsx";
import './Login.scss';
import {IconCheck, IconLock, IconMailFilled} from "@tabler/icons-react";
import {Button, Text, TextInput, Title, useMantineColorScheme} from "@mantine/core";
import {notifications} from "@mantine/notifications";

export default function Login() {
    const { colorScheme } = useMantineColorScheme();
    const { setUser } = useContext(UserContext);

    useEffect(() => {
        console.log('Login component is mounted');
    })

    const form = useForm({
        initialValues: {
            email: "pierre.bihannic@pixelart.com",
            password: "PixelPass1!",
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email address'),
            password: (value) => (value.length > 4 ? null : 'Password is too short'),
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
                icon: <IconCheck size={24} />,
            });
        },
        onError: (error) => {
            console.log(error);
            notifications.show({
                title: 'Error !',
                message: 'Credentials incorrects ! Please try again',
                autoClose: 4000,
                color: 'red',
                loading: false
            });
        }
    });

    const onSubmit = (data) => {
        console.log(data);
        login.mutate(data);
    }

    return (
        <form onSubmit={form.onSubmit(onSubmit)} className="login">
            <BackgroundIllustration />
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
                <Button fullWidth variant="filled" color="rgba(29, 104, 184, 1)">Register</Button>
            </div>
        </form>

    )
}