import { useEffect, useState } from "react";

interface LoadingDotsProps {
  speed?: number; // em ms
}

export function LoadingDots({ speed = 500 }: LoadingDotsProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, speed);

    return () => clearInterval(interval);
  }, [speed]);

  return <span>{dots}</span>;
}
