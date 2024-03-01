import {useMediaQuery} from "@mantine/hooks";
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {UserContext} from "../../provider/UserContext.jsx";

export const isPixelBoardClosed = (pixelboard) => {
    let start = new Date(pixelboard.start_date).getTime()
    let end = new Date(pixelboard.end_date).getTime()
    let current = Date.now()
    return start < end && end < current
}
export const isPixelBoardStarted = (pixelboard) => {

    let start = new Date(pixelboard.start_date).getTime()
    let end = new Date(pixelboard.end_date).getTime()
    let current = Date.now()
    return start < end && start < current
}
export const isPixelBoardComingSoon = (pixelboard) => {

    let start = new Date(pixelboard.start_date).getTime()
    let end = new Date(pixelboard.end_date).getTime()
    let current = Date.now()
    return start < end && start > current
}

export const isSmallScreen = () => useMediaQuery('(max-width: 768px)');
export const isMediumScreen = () => useMediaQuery('(min-width: 769px) and (max-width: 992px)');
export const isLargeScreen = () => useMediaQuery('(min-width: 993px) and (max-width: 1200px)');
export const isExtraLargeScreen = () => useMediaQuery('(min-width: 1201px)');

export const numberPixelToDisplay = () => {
    let column = 4;
   if(isMediumScreen()) column = 6;
    if(isLargeScreen()) column =  4;
    if(isExtraLargeScreen()) column = 4;
    if (isSmallScreen()) column = 12;
    console.log(column)
    return column;
}


