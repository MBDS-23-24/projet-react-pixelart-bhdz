export function formatedDate(date) {
    return new Date(date).toLocaleString();
}

export function sortArrayByDate(array) {
    return array.sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));
}