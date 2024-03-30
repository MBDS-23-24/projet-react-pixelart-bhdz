import prisma from "../prisma/client.js";
import {AppLogger} from "../logger/app-logger.js";
import {userService} from "./user.service.js";

const pixelBoardService = {
    async getAllPixelBoards(){
        let list = await prisma.pixelBoard.findMany();

        for (let i = 0; i < list.length; i++) {
            list[i].participants = await this.getAllUsersThatHaveDrawnOnPixelBoard(list[i].id);
        }

        return list;
    },

    async getPixelBoardById(pixelBoardId) {
        return prisma.pixelBoard.findUnique({
            where: {
                id: pixelBoardId
            }
        });
    },

    async getPixels(pixelBoardId) {
        const pixels = []
        const lines = await prisma.line.findMany({
            where: {
                pixelBoardId: pixelBoardId
            }
        });


        lines.forEach(line => {
            const y = line.position;
            line.pixels.forEach(pixel => {
                pixels.push({
                    x: pixel.position,
                    y: y,
                    color: pixel.hexaColor,
                    ownerId: line.ownerId
                })
            })
        });
        return pixels;
    },

    async getHistoryPixels(pixelBoardId) {
        const pixels = [];
        const lines = await prisma.line.findMany({
            where: {
                pixelBoardId: pixelBoardId
            }
        });

        const distinctOwnerIds = new Set();
        for (const line of lines) {
            for (const pixel of line.pixels) {
                distinctOwnerIds.add(pixel.ownerId);
            }
        }

        const distinctOwnerIdsArray = Array.from(distinctOwnerIds);
        const usersMap = await userService.getUsernameByListUserId(distinctOwnerIdsArray);

        for (const line of lines) {
            const y = line.position;
            for (const pixel of line.pixels) {
                const user = usersMap.get(pixel.ownerId);
                pixels.push({
                    position: "[" + pixel.position + "," + y + "]",
                    color: pixel.hexaColor,
                    user: user,
                    lastUpdate: pixel.lastUpdate
                });
            }
        }
        return pixels;
    },

    async getAllUsersThatHaveDrawnOnPixelBoard(pixelBoardId) {
        const lines = await prisma.line.findMany({
            where: {
                pixelBoardId: pixelBoardId
            }
        });

        const distinctOwnerIds = new Set();
        for (const line of lines) {
            for (const pixel of line.pixels) {
                distinctOwnerIds.add(pixel.ownerId);
            }
        }

        let listOfUsers = await userService.getUsersByListUserId(Array.from(distinctOwnerIds));

        return Array.from(listOfUsers);
    },

    async insertPixels(boardId, pixels) {
        const linesConcerned = [...new Set(pixels.map(p => p.y))];

        const newLinesDatabaseFormat = linesConcerned.map((linePositionY) => {
            const pixelsForLine = pixels.filter(p => p.y === linePositionY);
            const pixelsDbFormat = pixelsForLine.map(p => ({
                position: parseInt(p.x),
                hexaColor: p.color,
                ownerId: p.ownerId,
                lastUpdate: p.lastUpdate
            }));
            return {
                position: parseInt(linePositionY),
                pixelBoard: {
                    connect: {
                        id: boardId
                    }
                },
                pixels: pixelsDbFormat
            }
        })

        const existingLines = await prisma.line.findMany({
            where: {
                pixelBoardId: boardId
            },
            include: {
                pixelBoard: true
            }
        });

        function mergePixel(existingLine, newLine, isPixelOverride) {
            if (!existingLine || !newLine || !isPixelOverride === undefined) {
                AppLogger.log("warning", 'PixelBoard', 'To merge pixels, existing line, new line and isPixelOverride are required.');
            }
            if (existingLine.position !== newLine.position) {
                AppLogger.log("warning", 'PixelBoard', 'The position of the existing line and the new line must be the same');
            }

            function distinctByAttribute(array, attribute) {
                const distinctValues = new Set();
                const distinctObjects = [];

                array.forEach(obj => {
                    if (!distinctValues.has(obj[attribute])) {
                        distinctValues.add(obj[attribute]);
                        distinctObjects.push(obj);
                    }
                });

                return distinctObjects;
            };

            const distinctExistingPixels = distinctByAttribute(existingLine.pixels, 'position')

            newLine.pixels.forEach(newPixel => {
                const indexOfExistingPixel = distinctExistingPixels.findIndex(p => p.position === newPixel.position);
                if (indexOfExistingPixel === -1) {
                    distinctExistingPixels.push(newPixel);
                } else if (indexOfExistingPixel >= 0 && isPixelOverride === true) {
                    distinctExistingPixels[indexOfExistingPixel].hexaColor = newPixel.hexaColor;
                } else {
                    AppLogger.log("warning", 'PixelBoard', 'Pixel already exists or cannot be overwritten');
                }
            })
            return distinctExistingPixels;
        }

        const getIdExistingLines = (positionY, pixelBoardId) => {
            return existingLines.find(l => l.position === positionY && l.pixelBoardId === pixelBoardId)
        }

        const result = []
        for (let i = 0; i < newLinesDatabaseFormat.length; i++) {
            const existingLineConcerned = getIdExistingLines(newLinesDatabaseFormat[i].position, boardId);

            if (existingLineConcerned) {
                const lineUpdated = await prisma.line.update({
                    where: {
                        id: existingLineConcerned.id
                    },
                    data: {
                        pixels: mergePixel(existingLineConcerned, newLinesDatabaseFormat[i], existingLines[i]?.pixelBoard?.isPixelOverwrite)
                    }
                })
                result.push(lineUpdated);
            } else {
                const lineCreated = await prisma.line.create({
                    data: newLinesDatabaseFormat[i]
                })
                result.push(lineCreated);
            }
        }
        return result;
    }
}

export default pixelBoardService;