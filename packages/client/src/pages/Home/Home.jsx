import {useNavigate} from "react-router-dom";

import {Button, Card, Menu, Text, TextInput, Title} from '@mantine/core';
import {IconFilter, IconSearch} from '@tabler/icons-react';
import {useState} from "react";
import {getAllPixelBoards} from "../../functions/backend_functions/pixelboard_backend_functions.js"
import './Home.scss';
import ListCardsPixelBoard from "../../components/CardPixelBoard/ListCardsPixelBoard.jsx";
import {useQuery} from "react-query";
import {getNumberOfUsers} from "../../functions/backend_functions/user_backend_functions.js";

function Home() {
    const [nbRegist, setNbRegist] = useState(0);
    const [pixelBoards, setPixelBoards] = useState([]);
    const [pixelBoardsFiltered, setPixelBoardsFiltered] = useState([]);
    const navigate = useNavigate();

    useQuery('pixelboards', getAllPixelBoards, {
        onSuccess: (data) => {
            setPixelBoards(data);
            setPixelBoardsFiltered(data);
        }
    });

    useQuery('numbers of users', getNumberOfUsers, {
        onSuccess: (data) => {
            setNbRegist(data);
        }
    });

    const onSearchBoard = (event) => {
        if (event.target.value === "")
            setPixelBoardsFiltered(pixelBoards);
        setPixelBoardsFiltered(pixelBoards.filter(obj => obj.title.includes(event.target.value)));
    }

    const navigateToBoard = (endpoint) => {
        navigate(endpoint);
    }

    return (
        <div className={"home-page"}>
            <div className={"card-info"}>
                <Card shadow="xs" padding="md">
                    <Text align={"center"}>Number of registrants</Text>
                    <Title  align={"center"}>{nbRegist}</Title>
                </Card>
            </div>
            <h2>Pixel Board enjoy drawing</h2>
            <div className={"input-sort"}>
                <TextInput size="md" className={"search"} placeholder="Search Board Name" rightSection={<IconSearch size={20}/>}
                           onChange={onSearchBoard}/>
                <Card shadow="xs" padding="xs">
                    <Text align={"center"}>results : {pixelBoardsFiltered.length}</Text>
                </Card>
            </div>
            <ListCardsPixelBoard pixelboards={pixelBoardsFiltered} navigateToBoard={navigateToBoard}/>
        </div>
    );
}

export default Home