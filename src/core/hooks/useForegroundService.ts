import { useEffect } from 'react';

import ForegroundService from '#services/ForegroundService';

import { EnumTrackerStatus } from '#config/enums';

import { useSelector } from '#store';

const useForegroundService = () => {
  const location = useSelector(state => state.location);
  const tracker = useSelector(state => state.tracker);

  useEffect(() => {
    if (tracker.status === EnumTrackerStatus.ACTIVE) {
      ForegroundService.start('Идёт учет времени');
      return;
    }

    if (location.isActive || location.shouldPersist) {
      ForegroundService.start('Идёт отслеживание месторасположения');
      return;
    }

    ForegroundService.stop();
  }, [tracker, location.isActive, location.shouldPersist]);
};

export default useForegroundService;
