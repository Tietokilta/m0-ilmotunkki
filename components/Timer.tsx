import { useContext, useEffect, useState } from "react"
import styled from "styled-components";
import { AppContext } from "../context/AppContext"

const padNumber = (number: number) => String(number).length > 1 ? String(number) : `0${number}`;

const TimerWrapper = styled.div`
  height: 1rem;
`
type TimerProps = {
  status: string;
  created: Date;
  reset: () => void;
}


const Timer: React.FC<TimerProps> = ({reset, status, created}) => {
  const [interval, setIntervalValue] = useState<ReturnType<typeof setTimeout>>();
  const [ time, setTime ] = useState(0);
  const minutes = Math.floor(time/60);
  const seconds = Math.floor(time-minutes*60);
  useEffect(() => {
    if (interval) return;
    const totalAmountOfMinutes = status === 'new' ? 15 : 30;
    setTime(Math.floor((created.getTime() + totalAmountOfMinutes * 1000*60 - Date.now())/1000));
    const intervalValue = setInterval(() => {
      const newTime = Math.floor((created.getTime() + totalAmountOfMinutes * 1000 * 60 - Date.now())/1000);
      setTime(newTime);
    },1000);
    setIntervalValue(intervalValue);
    return () => {
      if(interval) clearInterval(interval);
    }
  },[created, status, interval,time]);
  useEffect(() => {
    if (time < 0) {
      if(interval) {
        clearInterval(interval);
      }
      setTime(0);
      reset();
    }
  },[time,interval,reset]);
  
  if(time < 0) return null;

  return (
    <>
      {`${padNumber(minutes)}:${padNumber(seconds)}`}
    </>
  )
}

const Parent = () => {
  const {order, reset} = useContext(AppContext);
  const handleReset = () => {
    reset();
  }
  return (
    <TimerWrapper>
      {order &&
      order.attributes.createdAt &&
      order.attributes.status !== 'ok'
      && <Timer 
        created={new Date(order.attributes.createdAt)}
        reset={handleReset}
        status={order.attributes.status} />}
    </TimerWrapper>
  )
}

export default Parent;