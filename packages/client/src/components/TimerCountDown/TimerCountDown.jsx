import {useEffect, useState} from "react";
import {Text} from "@mantine/core";
import './TimerCountDown.scss';

export default function TimerCountDown({ state="Online", endDate, startDate, refresh=false }) {
  const [textCountdown, setTextCountdown] = useState("...");

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            let endDate2 = new Date(state === "Coming soon" ? startDate : endDate).getTime();
            const distance = endDate2 - now;
            if (distance === 0) {
                if(refresh){
                    window.location.reload();
                }
                clearInterval(interval);
            } else {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                let countdownText = '';

                if (days > 30) {
                    countdownText = 'More than 30 days...';
                } else {
                    if (state === "Coming soon") countdownText += 'Starts in ';
                    if (state === "Online") countdownText += 'Will be closed in ';
                    if (days !== 0) countdownText += `${days}d `;
                    if (hours !== 0) countdownText += `${hours}h `;
                    if (minutes !== 0 || countdownText === '') countdownText += `${minutes}m `;
                    if (seconds !== 0 || countdownText === '') countdownText += `${seconds}s `;
                }

                setTextCountdown(countdownText.trim());
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [endDate]);

    return (<Text className={"text-countdown"}>{textCountdown}</Text>);
}