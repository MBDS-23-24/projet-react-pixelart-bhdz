
const Room = {
    private(userId) {
        return "private_" + userId.toString();
    },

    pixelBoard(pixelBoardId) {
        return "pixel_board_" + pixelBoardId.toString();
    },
}

export default Room;