import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../prisma/client.js";
import {BusinessError} from "../error/business.error.js";

const pixelBoardService = {

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

    async insertPixels(boardId, pixels) {
        const linesConcerned = pixels.map(p => p.y);
        const ownersIdsConcerned = pixels.map(p => p.ownerId);


        const newLinesDatabaseFormat = linesConcerned.map((linePositionY) => {
            const pixelsForLine = pixels.filter(p => p.y === linePositionY);
            const pixelsDbFormat = pixelsForLine.map(p => ({position: p.x, hexaColor: p.color}));
            return {
                position: linePositionY,
                owner: {
                    connect: {
                        id: pixels[0].ownerId
                    }
                },
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
                pixelBoardId: boardId,
                owner : {
                    id : {
                        in : ownersIdsConcerned
                    }
                }
            },
            include: {
                pixelBoard: true
            }
        });

        function mergePixel(existingLine, newLine, isPixelOverride) {
            if (!existingLine || !newLine || !isPixelOverride) {
                throw BusinessError(400, 'Bad request', 'To merge pixels, existing line, new line and isPixelOverride are required.');
            }
            const newPixelsForLine = [...existingLine.pixels];

            newLine.pixels.forEach(newPixel => {
                const indexOfExistingPixel = newPixelsForLine.findIndex(p => p.position === newPixel.position);
                if (indexOfExistingPixel === -1) {
                    newPixelsForLine.push(newPixel);
                } else if (indexOfExistingPixel >= 0 && isPixelOverride) {
                    newPixelsForLine[indexOfExistingPixel].hexaColor = newPixel.hexaColor;
                } else {
                    throw BusinessError(400, 'Bad request', 'Pixel already exists or cannot be overwritten');
                }
            })
            return newPixelsForLine;
        }

        const getIdExistingLines = (positionY, pixelBoardId, ownerId) => {
            return existingLines.find(l => l.position === positionY && l.pixelBoardId === pixelBoardId && l.ownerId === ownerId)
        }

        for (let i = 0; i < newLinesDatabaseFormat.length; i++) {
            const existingLineConcerned = getIdExistingLines(newLinesDatabaseFormat[i].position, boardId, newLinesDatabaseFormat[i].owner.connect.id);

            if (existingLineConcerned) {
                await prisma.line.update({
                    where: {
                        id: existingLineConcerned.id
                    },
                    data: {
                        pixels: mergePixel(existingLineConcerned, newLinesDatabaseFormat[i], existingLines[i]?.pixelBoard?.isPixelOverwrite)
                    }
                })
            } else {
                await prisma.line.create({
                    data: newLinesDatabaseFormat[i]
                })
            }


        }
        return newLinesDatabaseFormat;
    }
}

export default pixelBoardService;