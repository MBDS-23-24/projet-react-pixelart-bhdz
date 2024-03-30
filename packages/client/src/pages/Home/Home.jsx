import {Link, useNavigate} from "react-router-dom";
import {logoutUser, UserContext} from "../../provider/UserContext.jsx";

import {Badge, Button, Card, Grid, Group, Text, TextInput, Title} from '@mantine/core';
import {IconFilter, IconHttpGet, IconLink, IconLogin, IconSearch, IconUser} from '@tabler/icons-react';
import React, {useContext, useEffect, useState} from "react";
import {getAllPixelBoards} from "../../functions/backend_functions/pixelboard_backend_functions.js"
import {isPixelBoardClosed, isPixelBoardComingSoon, isPixelBoardStarted, numberPixelToDisplay} from "../utils/Utils.js";

function Home() {
    const [actionAndPixel, setActionAndPixel] = useState({})
    const [pixelBoards, setPixelBoards] = useState([]);
    const navigate = useNavigate();
    const filteredAndSorted = {
        filter: {
            is_pixel_overwrite: true,
            end_date: "2024-04-25",
            title: "Example Test 2" // Ajout du critère "title"
        },
        sort: {
            by: "start_date",
            order: "asc"
        }
    };
    useEffect(() => {
        getAllPixelBoards().then(data => {
            console.log("From home",data)
            setPixelBoards(data)
        })
    }, [])

    const onSearchBoard = (event) => {
        console.log(event.currentTarget.value)
       const pixels = pixelBoards.filter(pixelBoard => pixelBoard.title.includes(event.currentTarget.value))
        console.log(pixels)

        // setPixelBoards(pixels)
    }

    function applyFiltersAndSort(data, filters, sortOptions) {
        let result = data;
        console.log(result)

        // Apply filters
        if (filters) {
            result = result.filter(obj => obj.end_date === filters.end_date || obj.title === filters.title || obj.is_pixel_overwrite === filters.is_pixel_overwrite)
        }

        // Apply sorting
        if (sortOptions && sortOptions.by) {
            result = result.sort((a, b) => {
                const by = sortOptions.by
                const valueA = new Date(a[by]).getTime();
                const valueB = new Date(b[by]).getTime();

                if (sortOptions.order === "asc") {
                    return valueA - valueB;
                } else if (sortOptions.order === "desc") {
                    return valueB - valueA;
                } else {
                    return 0;
                }
            });
        }
        console.log(result)
        // setPixelBoards(result)
    }
    const navigateToBoard = (endpoint) => {
        navigate(endpoint);
    }

    return (
        <div>
            <h2>Pixel Board enjoy drawing</h2>
            <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: 20}}>
                <TextInput placeholder="Search Board Name" rightSection={<IconSearch size={20} />} onChange={onSearchBoard}/>
                <Button
                    color="green"
                    mt="md" radius="md"
                    variant='light'
                    rightSection={<IconFilter size={14}/>}
                    onClick={() => applyFiltersAndSort(pixelBoards, filteredAndSorted.filter, filteredAndSorted.sort)}
                >
                    Filter And Sort
                </Button>
            </div>
            <PrintPixel pixelboards={pixelBoards} navigateToBoard={navigateToBoard}/>
        </div>
    );
}

const styles = {
    heightCard: {
        height: "80"
    } ,
    widthCard: {
        width: "80"
    }
}

const PrintPixel = (props) => {
    const {pixelboards,navigateToBoard} = props
    console.log('Pixel Boards:', pixelboards);
    const {user} = useContext(UserContext)
 const isUserLoggedIn = () => {
        return user != null;
    }
 const drawOnBoard = (pixelBoard) => {
    if (isUserLoggedIn()){

    }
 }

    const setColor = (pixelboard) => {
        let color = 'blue';
        if (isPixelBoardComingSoon(pixelboard)) color = 'blue';
        if (isPixelBoardStarted(pixelboard)) color = 'green';
        if (isPixelBoardClosed(pixelboard)) color = 'red';
        return color
    }
    const setLabel = (pixelboard) => {
        let label = 'Coming soon';
        if (isPixelBoardComingSoon(pixelboard)) label = 'Coming soon';
        if (isPixelBoardStarted(pixelboard)) label = 'Online';
        if (isPixelBoardClosed(pixelboard)) label = 'Closed';
        return label;
    }

    return <Grid gutter='sm' style={{marginLeft: 100, marginRight: 20}}>
        {pixelboards.map((pixelBoard, index) =>
            <Grid.Col key={index} span={numberPixelToDisplay()} >
                <Card key={index} shadow="sm" padding="xs" radius="lg" withBorder>
                    <Title component="h3">
                        {pixelBoard.title}
                    </Title>
                    <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={500}>Status:</Text>
                        <Badge color={setColor(pixelBoard)}>{ setLabel(pixelBoard)}</Badge>
                    </Group>

                    <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={500}> Date: </Text>
                        <Badge color={setColor(pixelBoard)}>2024-05-24</Badge>
                    </Group>
                    <Group justify="flex-around">
                        <Button
                            color="green"
                            mt="md" radius="md"
                            rightSection={<IconUser size={14} /> } onClick = {() => drawOnBoard(pixelBoard)}
                        >
                        S'incrire à ce board
                        </Button>
                        {isPixelBoardComingSoon(pixelBoard) ? "": <Button
                            color="blue"
                            mt="md" radius="md"
                            variant='light'
                            rightSection={<IconLink size={14}/>}
                            onClick={() =>navigateToBoard(`/pixel-board/${pixelBoard.id}`)}
                        >
                            Voir le board
                        </Button>}
                    </Group>
                </Card>
        </Grid.Col>
        )}
    </Grid>
}

export default Home