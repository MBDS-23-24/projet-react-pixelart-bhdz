import {useContext} from "react";
import { useForm } from "react-hook-form"
import {useMutation} from "react-query";
import {UserContext} from "../../provider/UserContext.jsx";
import {loginUser} from "../../functions/backend_functions/user_backend_functions.js";
import Illustration from "./Illustration.jsx";
import './Login.scss';
import {IconCheck, IconLock, IconMailFilled} from "@tabler/icons-react";
import {Anchor, Button, Checkbox, Group, Input, Text, Title} from "@mantine/core";
import {notifications} from "@mantine/notifications";

export default function Login() {
    const { user, setUser } = useContext(UserContext);

    const { register, handleSubmit } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        errors: {
            email: {
                type: "required",
                message: "Email is required"
            },
            password: {
                type: "required",
                message: "Password is required"
            }
        }
    });

    const login = useMutation((user) => loginUser(user), {
        onSuccess: (data) => {
            setTimeout(() => {
                setUser(data);
                window.location.reload();
                window.location.href = '/';

                }, 1000
            )
            notifications.show({
                title: "Connexion réussie",
                message: "Vous êtes maintenant connecté",
                color: "green",
                icon: <IconCheck size={24} />,
            });
        },
        onError: (error) => {
            console.log(error);
        }
    });

    const onSubmit = (data) => {
        console.log(data);
        login.mutate(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="login">
            <Illustration />
            <div className="card">
                <div>
                    <Title order={3} className={"b-900"}>Connexion</Title>
                    <Text className={"b-600"} size="sm" color="dimmed">Connectez-vous à votre compte</Text>
                </div>
                <Input id="email"
                       placeholder={"Email"}
                       size="md"
                       leftSection={
                           <IconMailFilled size={24}
                           />
                       }
                       {...register('email', { required: true })}
                />

                <Input id="password"
                       type="password"
                       placeholder={"Mot de passe"}
                       size="md"
                       leftSection={
                           <IconLock size={24}
                           />
                       }
                        {...register('password', { required: true })} />
                <Button fullWidth type="submit">Login</Button>
                <Button fullWidth variant="filled" color="rgba(29, 104, 184, 1)">Inscrivez-vous</Button>
            </div>
        </form>

    )
}