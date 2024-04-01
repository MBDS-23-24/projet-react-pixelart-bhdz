import React, {useState, useEffect} from 'react';
import {getElapsedTime} from "../../pages/utils/Utils.js";
import {Progress} from '@mantine/core';

const TimerComponent = ({startTimer, thresholdInMs, callback}) => {
    const [timeLeft, setTimeLeft] = useState(thresholdInMs);
    const [progress, setProgress] = useState(0);

    const refresh = () => {
        let remainingTimeResult = remainingTime();
        remainingTimeResult = Math.round(remainingTimeResult * 10) / 10;
        setTimeLeft(remainingTimeResult);
        setProgress(calculateProgress());
    }

    const remainingTime = () => {
        const elapsedTime = getElapsedTime(startTimer) / 1000
        const remainingTime = (thresholdInMs / 1000) - elapsedTime;

        if (remainingTime < 0)
            return 0;
        return remainingTime;

    }

    useEffect(() => {


        refresh();
        const interval = setInterval(() => {
            refresh();
        }, 100);


        return () => clearInterval(interval);
    }, [startTimer]);

    function calculateProgress() {
        const elapsedTime = getElapsedTime(startTimer);
        return (elapsedTime / (thresholdInMs)) * 100;
    }

    useEffect(() => {
        if (timeLeft === 0) {
            callback();
        }
    }, [timeLeft]);

    return (
        <>
            {timeLeft <= thresholdInMs && timeLeft > 0 && (
                <div className="countdown-timer">
                    <Progress.Root size="xl">
                        <Progress.Section value={100 - progress}>
                            <Progress.Label>
                                <div style={{fontSize:'1rem', padding:'5px'}}>
                                    {timeLeft}s
                                </div>
                            </Progress.Label>
                        </Progress.Section>
                    </Progress.Root>

                </div>
            )}
        </>
    );
};

const MemoizedTimerComponent = React.memo(TimerComponent);


export default MemoizedTimerComponent;
