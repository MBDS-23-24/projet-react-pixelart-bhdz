const Room = {
    private(userId) {
        return "private_" + userId.toString();
    },

    pixelBoardPrivate(userId, pixelBoardId) {
        return this.private(userId) + "_" + this.pixelBoard(pixelBoardId);
    },

    pixelBoard(pixelBoardId) {
        return "pixel_board_" + pixelBoardId.toString();
    },
}

export default Room;