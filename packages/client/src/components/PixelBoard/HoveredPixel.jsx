import {useRef, useState, useEffect} from 'react';



export default function HoveredPixel({
                                  width, height, pixelSize, currentHoveredPixel
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
        drawHoveredPixel();
    }, [currentHoveredPixel]);


    function drawHoveredPixel() {
        if (ctx && currentHoveredPixel) {
            ctx.clearRect(0, 0, realWidth, realHeight);
            ctx.fillStyle = currentHoveredPixel.color;
            ctx.fillRect(currentHoveredPixel.x * pixelSize, currentHoveredPixel.y * pixelSize, pixelSize, pixelSize);
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
