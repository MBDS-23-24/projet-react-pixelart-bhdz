import {useContext, useState} from 'react';
import {Center, Tooltip, UnstyledButton, Stack, rem, useMantineColorScheme, Avatar} from '@mantine/core';
import {
    IconHome2,
    IconGauge,
    IconUser,
    IconSettings,
    IconLogout,
    IconUsers
} from '@tabler/icons-react';
import "./Navbar.scss";
import {Link} from "react-router-dom";
import {logoutUser, UserContext} from "../../provider/UserContext.jsx";
import {SliderDarkMode} from "../SliderDarkMode/SliderDarkMode.jsx";
import {hasRightToAccess} from "../../utils/Utils.js";

function NavbarLink({ icon: Icon, label, active, onClick, link, isHidden=false}) {
    const { colorScheme } = useMantineColorScheme()

    if (isHidden) return null;

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
    { icon: IconGauge, label: 'Dashboard', link: "/dashboard", needRight: true},
    { icon: IconHome2, label: 'Home', link: "/", needRight: false },
    { icon: IconSettings, label: 'Account', link: "/account", needRight: false},
    { icon: IconUsers, label: 'Contributors', link: "/contributors", needRight: true},
];

export function NavBar() {
    const {user} = useContext(UserContext);
    const [indexActiveLinkRoute, setIndexActiveLinkRoute] = useState(0);

    const links = listLinkedRoute.map((link, index) => (
        <NavbarLink
            {...link}
            style={{ color: "white"}}
            key={link.label}
            active={index === indexActiveLinkRoute}
            onClick={() => setIndexActiveLinkRoute(index)}
            link={link.link}
            isHidden={!hasRightToAccess(user, link)}
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
                <Avatar src={user.accountImageUrl} alt="logo" className={"logo-profile"} size={"lg"} radius={"lg"}/>
                <p className={"text-username"}>{user.username}</p>
            </Stack>
        </nav>
    );
}