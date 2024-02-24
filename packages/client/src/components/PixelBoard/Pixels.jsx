import {useRef, useState, useEffect, forwardRef, useImperativeHandle} from 'react';


const Pixels = forwardRef(function MyInput({onNewPixelAdded, initPixel, width, height, pixelSize}, ref) {
    const canvasRef = useRef(); // Référence vers le canvas
    const [ctx, setCtx] = useState(null);

    useEffect(() => {
        if (ctx && initPixel.length > 0) {
            initPixel.forEach(pixel => {
                drawPixel(pixel);
            });
        }
    }, [ctx, initPixel]);

    useImperativeHandle(ref, () => ({
        drawPixel
    }));


    function getRealPosition(pixelPosition) {
        return pixelPosition * pixelSize;
    }

    const realWidth = width * pixelSize;
    const realHeight = height * pixelSize;

    useEffect(() => {
        if (canvasRef.current) {
            setCtx(canvasRef.current.getContext('2d'));
        }
    }, [canvasRef]);

    useEffect(() => {
        if (ctx) {
            onNewPixelAdded(drawPixel);
        }
    }, [ctx, onNewPixelAdded]);

    function drawPixel(pixel) {
        if (ctx) {
            ctx.fillStyle = pixel.color;
            ctx.fillRect(getRealPosition(pixel.x), getRealPosition(pixel.y), pixelSize, pixelSize);
        }
    }

    return (
        <canvas
            ref={canvasRef}
            width={realWidth}
            height={realHeight}
        ></canvas>
    );
});


export default Pixels;
