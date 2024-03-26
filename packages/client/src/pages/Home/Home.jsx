import {useNavigate} from "react-router-dom";
import {UserContext} from "../../provider/UserContext.jsx";

import {Badge, Button, Card, Grid, Group, Menu, Text, TextInput, Title} from '@mantine/core';
import {IconFilter, IconLink, IconSearch, IconUser} from '@tabler/icons-react';
import {useContext, useEffect, useState} from "react";
import {getAllPixelBoards} from "../../functions/backend_functions/pixelboard_backend_functions.js"
import {isPixelBoardClosed, isPixelBoardComingSoon, isPixelBoardStarted, numberPixelToDisplay} from "../utils/utils.js";
import './Home.scss';
import ListCardsPixelBoard from "../../components/CardPixelBoard/ListCardsPixelBoard.jsx";
import {useQuery} from "react-query";

function Home() {
    const [pixelBoards, setPixelBoards] = useState([]);
    const [pixelBoardsFiltered, setPixelBoardsFiltered] = useState([]);
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

    useQuery('pixelboards', getAllPixelBoards, {
        onSuccess: (data) => {
            setPixelBoards(data);
            setPixelBoardsFiltered(data);
        }
    });

    const onSearchBoard = (event) => {
        if (event.target.value === "")
            setPixelBoardsFiltered(pixelBoards);
        setPixelBoardsFiltered(pixelBoards.filter(obj => obj.title.includes(event.target.value)));
    }

    function applyFiltersAndSort(event) {
        if (event === 'Filter by Name') {
            setPixelBoardsFiltered(pixelBoards.sort((a, b) => a.title.localeCompare(b.title)));
        } else {
            setPixelBoardsFiltered(pixelBoards.sort((a, b) => new Date(a.start_date) - new Date(b.start_date)));
        }
        console.log('applyFiltersAndSort', event);
    }
    const navigateToBoard = (endpoint) => {
        navigate(endpoint);
    }

    return (
        <div className={"home-page"}>
            <h2>Pixel Board enjoy drawing</h2>
            <div className={"input-sort"}>
                <TextInput placeholder="Search Board Name" rightSection={<IconSearch size={20} />} onChange={onSearchBoard}/>

                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <Button
                            color="green"
                            radius="md"
                            variant='light'
                            rightSection={<IconFilter size={14}/>}
                            onClick={() => applyFiltersAndSort(pixelBoards, filteredAndSorted.filter, filteredAndSorted.sort)}>
                            Filter And Sort
                        </Button>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Item onClick={() => applyFiltersAndSort('Filter by Name')}>Filter by Name</Menu.Item>
                        <Menu.Item onClick={() => applyFiltersAndSort('Filter by Date')}>Filter by Date</Menu.Item>
                    </Menu.Dropdown>
                </Menu>

            </div>
            <ListCardsPixelBoard pixelboards={pixelBoardsFiltered} navigateToBoard={navigateToBoard}/>
        </div>
    );
}

export default Home