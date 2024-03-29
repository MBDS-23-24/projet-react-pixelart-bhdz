import {useContext, useState} from 'react';
import {Center, Tooltip, UnstyledButton, Stack, rem, useMantineColorScheme, Avatar} from '@mantine/core';
import {
    IconHome2,
    IconGauge,
    IconSettings,
    IconLogout, IconUsers,
} from '@tabler/icons-react';
import "./Navbar.scss";
import {Link} from "react-router-dom";
import {logoutUser, UserContext} from "../../provider/UserContext.jsx";
import {SliderDarkMode} from "../SliderDarkMode/SliderDarkMode.jsx";

function NavbarLink({ icon: Icon, label, active, onClick, link }) {
    const { colorScheme } = useMantineColorScheme()

    return (
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
            <Link to={link} className={"link"} data-active={active || undefined} dark-mode={(colorScheme === "dark").toString()}>
                <UnstyledButton onClick={onClick} className={"link"} data-active={active || undefined}>
                    <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
                </UnstyledButton>
            </Link>
        </Tooltip>
    );
}

const listLinkedRoute = [
    { icon: IconHome2, label: 'Home', link: "/" },
    { icon: IconGauge, label: 'Dashboard', link: "/dashboard"},
    { icon: IconSettings, label: 'Account', link: "/account"},
    { icon: IconUsers, label: 'Contributors', link: "/contributors"},
];

export function NavBar() {
    const {user} = useContext(UserContext);
    const [indexActiveLinkRoute, setIndexActiveLinkRoute] = useState(0);

    const links = listLinkedRoute.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={index === indexActiveLinkRoute}
            onClick={() => setIndexActiveLinkRoute(index)}
            link={link.link}
        />
    ));

    return (
        <nav className={"navbar"}>
            <Center>
                <img src={"/src/assets/logo.png"} alt="logo" className={"logo"}/>
            </Center>

            <div className={"navbarMain"}>
                <Stack justify="center" gap={0}>
                    {links}
                </Stack>
            </div>

            <Stack justify="center" align={"center"} gap={10}>
                <NavbarLink icon={IconLogout} label="Logout" onClick={()=>logoutUser()} />
                <SliderDarkMode />
                <Avatar src={"https://picsum.photos/200/300"} alt="logo" className={"logo-profile"} size={"lg"} radius={"lg"}/> {/** TODO: replace with user profile picture - TICKET #46 */}
                <p className={"text-username"}>{user.username}</p>
            </Stack>
        </nav>
    );
}