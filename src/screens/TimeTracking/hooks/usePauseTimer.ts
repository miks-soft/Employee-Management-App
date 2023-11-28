import { useEffect, useState } from 'react';

import { useSelector } from '#store';

const usePauseTimer = () => {
  const startDate = useSelector(store => store.timer.pauseStartDate);
  const offset = useSelector(store => store.timer.pauseOffset);

  const [timer, setTimer] = useState(offset);

  const calculateTimer = () => {
    const start = startDate ? new Date(startDate) : new Date();
    const current = new Date();
    const diff = current.getTime() - start.getTime();
    setTimer(offset + diff);
  };

  useEffect(() => {
    calculateTimer();
    const intervalId = setInterval(calculateTimer, 200);

    return () => clearInterval(intervalId);
  }, [startDate, offset]);

  return { timer };
};

export default usePauseTimer;
