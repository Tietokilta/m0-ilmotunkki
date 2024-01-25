"use client";
/**
 * This file is used to clear the cart context from the local storage.
 * In the future we should look into httpOnly cookies.
 */
import { useContext, useEffect, useRef } from "react";
import { AppContext } from "@/context/AppContext";

type Props = {
  isValid: boolean;
  paymentStatus: string;
};

const CallbackResetHandler = ({ isValid, paymentStatus }: Props) => {
  const { reset } = useContext(AppContext);
  const handled = useRef(false);
  useEffect(() => {
    if (isValid && paymentStatus === "ok" && !handled.current) {
      handled.current = true;
      reset();
    }
  }, [isValid, paymentStatus, reset]);
  return null;
};

export default CallbackResetHandler;
