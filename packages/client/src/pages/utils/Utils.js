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

export function getElapsedTime(date) {
    const now = new Date();
    const target = new Date(date);

    return Math.floor((now - target) )
}

export function formatedDateTime(date) {
    const options = {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
    return new Date(date).toLocaleDateString(undefined, options);
}

export function sortArrayByDate(array) {
    return array.sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));
}