import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {useContext} from "react";
import {useForm} from "react-hook-form";
import {useMutation} from "react-query";
import {UserContext} from "../../provider/UserContext.jsx";
import {loginUser} from "../../functions/backend_functions/user_backend_functions.js";

export default function Login() {
    const { user, setUser } = useContext(UserContext);

    const { register, handleSubmit, errors } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const login = useMutation((user) => loginUser(user), {
        onSuccess: (data) => {
            setUser(data);
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
            <div className="card">
                <div className="flex flex-column md:flex-row">
                    <div
                        className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-3 py-5">
                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">Username</label>
                            <InputText id="email" type="text" className="w-12rem" {...register('email', { required: true })}/>
                        </div>
                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <label className="w-6rem">Password</label>
                            <InputText id="password" type="password" className="w-12rem" {...register('password', { required: true })}/>
                        </div>
                        <Button label="Login" icon="pi pi-user" className="w-10rem mx-auto"></Button>
                    </div>
                </div>
            </div>
        </form>
    )
}