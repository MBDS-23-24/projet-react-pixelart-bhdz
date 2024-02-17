import { useState } from 'react';
import {Center, Tooltip, UnstyledButton, Stack, rem, useMantineColorScheme} from '@mantine/core';
import {
    IconHome2,
    IconGauge,
    IconUser,
    IconSettings,
    IconLogout,
} from '@tabler/icons-react';
import "./Navbar.scss";
import {Link} from "react-router-dom";
import {logoutUser} from "../../provider/UserContext.jsx";
import {SliderDarkMode} from "../SliderDarkMode/SliderDarkMode.jsx";

function NavbarLink({ icon: Icon, label, active, onClick, link }) {
    const { colorScheme } = useMantineColorScheme()

    return (
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
            <Link to={link} className={`link ${colorScheme === "light" ? "link-light" : "link-dark"}`} data-active={active || undefined}>
                <UnstyledButton onClick={onClick} className={"link"} data-active={active || undefined}>
                    <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
                </UnstyledButton>
            </Link>
        </Tooltip>
    );
}

const mockdata = [
    { icon: IconHome2, label: 'Home', link: "/" },
    { icon: IconGauge, label: 'Dashboard', link: "/dashboard"},
    { icon: IconUser, label: 'Account', link: "/account"},
    { icon: IconSettings, label: 'Settings', link: "/settings" },
];

export function NavBar() {
    const [active, setActive] = useState(0);

    const links = mockdata.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => setActive(index)}
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

            <Stack justify="center" gap={10}>
                <SliderDarkMode />
                <NavbarLink icon={IconLogout} label="Logout" onClick={()=>logoutUser()} />
            </Stack>
        </nav>
    );
}