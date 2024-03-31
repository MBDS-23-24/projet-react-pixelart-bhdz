import {forwardRef, useRef, useState, useEffect, useImperativeHandle} from 'react';

const HoveredPixel = forwardRef(({
                                     width, height, pixelSize,
                                 }, ref) => {

    const canvasRef = useRef();
    const [ctx, setCtx] = useState(null);

    const realWidth = width * pixelSize;
    const realHeight = height * pixelSize;

    useImperativeHandle(ref, () => ({
        drawHoveredPixel: drawHoveredPixel
    }));

    useEffect(() => {
        if (canvasRef.current) {
            setCtx(canvasRef.current.getContext('2d'));
        }
    }, []);

    function drawHoveredPixel(currentHoveredPixel) {
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
});

HoveredPixel.displayName = 'HoveredPixel';

export default HoveredPixel;
