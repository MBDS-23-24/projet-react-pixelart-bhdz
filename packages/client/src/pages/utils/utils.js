import {useMediaQuery} from "@mantine/hooks";
export function formatedDateCountDown(date) {
    const now = new Date();
    const target = new Date(date);
    const diff = now - target;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const remainingSeconds = seconds % 60;
    const remainingMinutes = minutes % 60;
    const remainingHours = hours % 24;

    const timeParts = [];
    if (remainingHours > 0) {
        timeParts.push(`${remainingHours}h `);
    }
    if (remainingMinutes > 0) {
        timeParts.push(`${remainingMinutes}min `);
    }
    if (remainingSeconds > 0) {
        timeParts.push(`${remainingSeconds}s `);
    }

    return `il y a ${timeParts.join('')}`;
}

export function formatedDate(date) {
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    return new Date(date).toLocaleDateString(undefined, options);
}

export function sortArrayByDate(array) {
    return array.sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));
}

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
    return start < end && start > current
}
export const isPixelBoardComingSoon = (pixelboard) => {

    let start = new Date(pixelboard.start_date).getTime()
    let end = new Date(pixelboard.end_date).getTime()
    let current = Date.now()
    return start < end && start < current
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


