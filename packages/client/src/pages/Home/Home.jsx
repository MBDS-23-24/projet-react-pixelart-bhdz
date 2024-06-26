import {useNavigate} from "react-router-dom";

import {Card, LoadingOverlay, Text, TextInput, Title} from '@mantine/core';
import {IconSearch} from '@tabler/icons-react';
import {useState} from "react";
import {
    getAllPixelBoardsWithParticipants
} from "../../functions/backend_functions/pixelboard_backend_functions.js"
import './Home.scss';
import ListCardsPixelBoard from "../../components/CardPixelBoard/ListCardsPixelBoard.jsx";
import {useQuery} from "react-query";
import {getNumberOfUsers} from "../../functions/backend_functions/user_backend_functions.js";

function Home() {
    const [pixelBoards, setPixelBoards] = useState([]);
    const [pixelBoardsFiltered, setPixelBoardsFiltered] = useState([]);
    const navigate = useNavigate();

    const {isLoading} =  useQuery('pixelboards', getAllPixelBoardsWithParticipants, {
        onSuccess: (data) => {
            setPixelBoards(data);
            setPixelBoardsFiltered(data);
        }
    });

    const {data: dataNumberRegist, isLoading: isLoadingNumberRegist} = useQuery('numbers of users', getNumberOfUsers);

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
            <h2>Pixel Board enjoy drawing</h2>
            <div className={"card-info"}>
                {!isLoadingNumberRegist && dataNumberRegist && <Card shadow="xs" padding="md">
                    <Text align={"center"}>Number of registrations</Text>
                    <Title align={"center"}>{dataNumberRegist}</Title>
                </Card>}
                {pixelBoards && <Card shadow="xs" padding="md">
                    <Text align={"center"}>Number of pixelboard(s)</Text>
                    <Title align={"center"}>{pixelBoards.length}</Title>
                </Card>}
            </div>
            <div className={"input-sort"}>
                <TextInput size="md" className={"search"} placeholder="Search Board Name"
                           rightSection={<IconSearch size={20}/>}
                           onChange={onSearchBoard}/>
            </div>

            <LoadingOverlay
                visible={isLoading}
                zIndex={1000}
                overlayProps={{radius: "sm", blur: 2}}/>

            <ListCardsPixelBoard pixelboards={pixelBoardsFiltered} navigateToBoard={navigateToBoard}/>
        </div>
    );
}

export default Home