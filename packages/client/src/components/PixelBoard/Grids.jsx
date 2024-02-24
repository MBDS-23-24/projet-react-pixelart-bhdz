import {useRef, useState, useEffect} from 'react';


export default function Grids({
                                  width, height, pixelSize
                              }) {
    const canvasRef = useRef();
    const [ctx, setCtx] = useState(null);


    const realWidth = width * pixelSize;
    const realHeight = height * pixelSize;

    useEffect(() => {
        if (canvasRef) {
            setCtx(canvasRef.current.getContext('2d'));
        }
    }, [canvasRef]);

    useEffect(() => {
        if (ctx) {
            drawGrid();
        }
    }, [ctx]);

    /**
     * Dessine la grille sur le canvas
     */
    function drawGrid() {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 0.1;

        for (let x = 0; x <= realWidth; x += pixelSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, realHeight);
            ctx.stroke();
        }

        for (let y = 0; y <= realHeight; y += pixelSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(realWidth, y);
            ctx.stroke();
        }
    }



    return (
            <canvas
                ref={canvasRef}
                width={realWidth}
                height={realHeight}
            ></canvas>

    );
}
