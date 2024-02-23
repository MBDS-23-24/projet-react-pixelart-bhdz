import {useRef, useState, useEffect} from 'react';

export default function PixelAnimation({
                                         width, height, pixelSize, currentDrawedPixel
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
            animateDrawedPixel();
        }
    }, [currentDrawedPixel]);


    function animateDrawedPixel() {
        if (ctx && currentDrawedPixel) {
            const { x, y } = currentDrawedPixel;
            const realX = x * pixelSize;
            const realY = y * pixelSize;

            const animationFrames = 15;
            let frame = 0;
             const draw = () => {
                ctx.clearRect(realX, realY, pixelSize, pixelSize);
                ctx.fillStyle = currentDrawedPixel.color;
                ctx.fillRect(realX-1.5, realY-1.5, pixelSize+3, pixelSize+3);

                frame++;
                if (frame <= animationFrames) {
                    requestAnimationFrame(draw);
                }else{
                    ctx.clearRect(0, 0, realWidth, realHeight);
                }
            }
            draw();

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
