"use client";
import React from "react";
import Countdown from "react-countdown";

type TimeType = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
};

interface CountDownProps {
  locale?: string;
}

const CountDown = ({ locale }: CountDownProps) => {
  const Completionist = () => <span>M0 on jo ja joku kusi jos tää näkyy!</span>;
  const localisedText = locale?.toLowerCase() === "fi" ?
    {days: "päivää",
      hours: "tuntia",
      minutes: "minuuttia",
      seconds: "sekuntia"} :
    {days: "days",
      hours: "hours",
      minutes: "minutes",
      seconds: "seconds"};

  const renderer = ({ days, hours, minutes, seconds, completed }: TimeType) => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      const headerName = "text-3xl m-1";
      const textName = "text-lg m-1";
      return (
        <div className="w-full p-10 flex items-baseline justify-center">
          <h1 className={headerName}>{days}</h1>
          <p className={textName}>{localisedText.days.toUpperCase()}</p>
          <h1 className={headerName}>{hours}</h1>
          <p className={textName}>{localisedText.hours.toUpperCase()}</p>
          <h1 className={headerName}>{minutes}</h1>
          <p className={textName}>{localisedText.minutes.toUpperCase()}</p>
          <h1 className={headerName}>{seconds}</h1>
          <p className={textName}>{localisedText.seconds.toUpperCase()}</p>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Countdown date={new Date("2026-02-13T14:00:00")} renderer={renderer} />
      <div className="text-center">
        <p className="text-3xl pb-8">{locale === "fi" ? 'Muistinnollaukseen 101000' : 'Until Muistinnollaus 101000'}</p>
      </div>
    </div>
  );
};

export default CountDown;
