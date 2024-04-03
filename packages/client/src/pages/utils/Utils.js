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

    return `${timeParts.join('')} ago`;
}

export function formatedDateTime(date) {
    const options = {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
    return new Date(date).toLocaleDateString('en', options);
}

export const getStatePixelBoard = (pixelboard) => {
    const start = new Date(pixelboard.startDate);
    const end = new Date(pixelboard.endDate);
    const current = Date.now();

    if (start <= current && end >= current) {
        return "Online";
    } else if (start > current) {
        return "Coming soon";
    } else {
        return "Closed";
    }
};

export const isPixelBoardComingSoon = (pixelBoard) => {
    let start = new Date(pixelBoard.startDate);
    let end = new Date(pixelBoard.endDate);
    let current = Date.now()
    return start > current && end > current;
}

export function getElapsedTime(date) {
    const now = new Date();
    const target = new Date(date);

    return Math.floor((now - target) )
}

export function formatedDateTime(date) {
    const options = {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
    return new Date(date).toLocaleDateString('en', options);
}

export const compareEqualsDateTime = (a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);

    console.log(dateA, dateB)

    return dateA.getFullYear() === dateB.getFullYear() && dateA.getMonth() === dateB.getMonth() && dateA.getDate() === dateB.getDate() && dateA.getHours() === dateB.getHours() && dateA.getMinutes() === dateB.getMinutes();
}

export function sortArrayByDate(array) {
    return array.sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));
}