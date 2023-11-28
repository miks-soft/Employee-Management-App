import { useEffect } from 'react';

import { WorktimeAPIRaw } from '#api/controllers/Worktime';

import Crashlytics from '#services/Crashlytics';
import ForegroundService from '#services/ForegroundService';
import LocationWatcher from '#services/LocationWatcher';
import NotificationManager from '#services/NotificationManager';
import Tracker from '#services/Tracker';
import BackgroundWorker from '#services/Tracker/BackgroundWorkers';

import { persistor, useSelector } from '#store';

const useAppLifecycle = () => {
  const tracker = useSelector(_store => _store.tracker);
  const app = useSelector(_store => _store.app);

  const onAppStart = async () => {
    BackgroundWorker.register();

    NotificationManager.init();
    Crashlytics.init();
    LocationWatcher.init();

    if (tracker?.project?.id && app.isSignedIn) {
      try {
        const res = await WorktimeAPIRaw.getTodayWorktime({
          params: {
            vacancy_id: tracker.project.id,
          },
        });

        Tracker.syncWithBE(res.data);
      } catch (e) {}
    }
  };

  const onAppEnd = () => {
    ForegroundService.stop(true);

    persistor.flush();
  };

  useEffect(() => {
    onAppStart();

    return onAppEnd;
  }, []);
};

export default useAppLifecycle;
