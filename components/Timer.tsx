import { useRouter } from "next/router";
import { useContext, useEffect, useState, useMemo } from "react"
import { AppContext } from "../context/AppContext"

const padNumber = (number: number) => String(number).length > 1 ? String(number) : `0${number}`;

const Timer = () => {
  const { order, reset } = useContext(AppContext);
  const router = useRouter();
  const created = useMemo(
    () => new Date(order.attributes.createdAt),
  [order.attributes.createdAt]);
  const status = order.attributes.status;
  const [interval, setIntervalValue] = useState<NodeJS.Timeout>();
  const [ time, setTime ] = useState(0);
  const minutes = Math.floor(time/60);
  const seconds = Math.floor(time-minutes*60);

  useEffect(() => {
    if (!order.id || status === 'ok' || interval) return;
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
  },[order.id, created, status, interval]);
  useEffect(() => {
    if (time < 0) {
      if(interval) {
        clearInterval(interval);
      }
      setTime(0);
      reset();
    }
  },[time,interval,reset,router]);
  
  if(!order.id || status === 'ok' || time < 0) return null;


  return (
    <div>
      {`${padNumber(minutes)}:${padNumber(seconds)}`}
    </div>
  )
}

export default Timer;