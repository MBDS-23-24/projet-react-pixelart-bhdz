import  { useRef, useState, useEffect } from 'react';

class Pixel {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
}

export default function PixelGrid(props) {
    const canvasRef = useRef(); // Référence vers le canvas
    const [ctx, setCtx] = useState(null);
    const pixelSize = 10; // Taille d'un pixel
    const [pixels] = useState([]);


    const { color, width, height } = props;

    useEffect(() => {
        pixels.forEach((pixel)=>{
            drawPixel(pixel.x, pixel.y, pixel.color)
        })
    }, [pixels]);

    useEffect(() => {
        // Initialisation du contexte 2D du canvas
        setCtx(canvasRef.current.getContext('2d'));
    }, []);

    useEffect(() => {
        if (ctx) {
            drawGrid();
        }
    }, [ctx, width, height]);

    /**
     * Dessine la grille sur le canvas
     */
    function drawGrid() {
        ctx.strokeStyle = '#6e6e6e'; // Couleur des lignes de la grille
        ctx.lineWidth = 0.1;

        // Dessin des lignes verticales
        for (let x = 0; x <= width; x += pixelSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // Dessin des lignes horizontales
        for (let y = 0; y <= height; y += pixelSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }

    /**
     * Gère le clic de la souris sur le canvas
     * @param event
     */
    function handleMouseClick(event) {
        const { offsetX, offsetY } = event.nativeEvent;
        const x = Math.floor(offsetX / pixelSize) * pixelSize;
        const y = Math.floor(offsetY / pixelSize) * pixelSize;
        drawPixel(x, y, color);
    }

    function drawPixel(x, y, color) {
        const pixel = new Pixel(x, y, color);
        pixels.push(pixel);
        ctx.fillStyle = pixel.color;
        ctx.fillRect(pixel.x, pixel.y, pixelSize, pixelSize);
    }

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            onClick={handleMouseClick}
        ></canvas>
    );
}
