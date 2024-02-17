import {Center, SegmentedControl, useMantineColorScheme} from "@mantine/core";
import './SliderDarkMode.scss';
import {IconMoon, IconSun} from "@tabler/icons-react";

export function SliderDarkMode() {
    const { colorScheme, setColorScheme } = useMantineColorScheme();

    function changeColorScheme(value) {
        setColorScheme(value);
    }

    return (
        <SegmentedControl
            radius="md"
            size="md"
            defaultValue={colorScheme}
            orientation="vertical"
            onChange={(value) => changeColorScheme(value)}
            transitionDuration={500}
            data={[
                { value: "light", label: (
                        <Center style={{ gap: 10 }}>
                            <IconSun style={{ width: 15, height: 15 }} />
                        </Center>
                    ), onClick: () => setColorScheme("light")
                },
                { value: "dark", label: (
                        <Center style={{ gap: 10 }}>
                            <IconMoon style={{ width: 15, height: 15 }} />
                        </Center>
                    ), onClick: () => setColorScheme("dark")
                },
            ]}
            classNames={"slider"}
        />
    )
}