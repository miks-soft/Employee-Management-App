import React, { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';
import { CompositeScreenProps, useIsFocused } from '@react-navigation/native';

import {
  ScheduleRoutes,
  ScheduleScreenProps,
} from '#navigation/Main/Schedule/types';
import { ModalsRoutes } from '#navigation/Modals/types';
import { AppRoutes, AppScreenProps } from '#navigation/types';

import { useGetProjectScheduleQuery } from '#api/controllers/Project';
import { WorktimeAPIRaw } from '#api/controllers/Worktime';

import Crashlytics from '#services/Crashlytics';
import LocationWatcher from '#services/LocationWatcher';
import ToastManager from '#services/ToastManager';
import Tracker from '#services/Tracker';
import Timer from '#services/Tracker/Timer';

import { __DEVELOPER__ } from '#config';
import { EnumTrackerStatus } from '#config/enums';

import useErrorHandler from '#hooks/utils/useErrorHandler';

import { delay } from '#utils';

import { reloadStore, useDispatch, useSelector } from '#store';
import { TrackerActions } from '#store/slices/tracker';

import { DTOProjectVacancy } from '#generated/types';

import usePauseTimer from './hooks/usePauseTimer';
import useTrackingTimer from './hooks/useTrackingTimer';
import Layout from './layout';

type NavigationProps = CompositeScreenProps<
  ScheduleScreenProps<ScheduleRoutes.TimeTracking>,
  AppScreenProps<AppRoutes>
>;

const Container: React.FC<NavigationProps> = props => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const { timer } = useTrackingTimer();
  const { timer: pauseTimer } = usePauseTimer();

  const status = useSelector(store => store.tracker.status);
  const storedProject = useSelector(store => store.tracker.project);
  const projectId = props.route.params?.id || storedProject?.id;

  const [isPausing, setIsPausing] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isSyncingPersistedState, setIsSyncingPersistedState] = useState(false);

  const projectScheduleQuery = useGetProjectScheduleQuery(
    {
      path: {
        plan: projectId!,
      },
    },
    {
      skip: !projectId,
    },
  );

  const onPause = async () => {
    setIsPausing(true);
    try {
      await Tracker.pause();
    } catch (e) {
      //@ts-ignore
      ToastManager.error(e.error.data.errors);
    } finally {
      setIsPausing(false);
    }
  };

  const onEnd = async () => {
    setIsEnding(true);
    try {
      await Tracker.end();
    } catch (e) {
      //@ts-ignore
      ToastManager.error(e.error.data.errors);
    } finally {
      setIsEnding(false);
    }
  };

  const onStart = async () => {
    setIsStarting(true);
    try {
      const havePermissions = await Tracker.requestPermissions();

      if (!havePermissions) {
        return;
      }

      const isInProjectZone = await LocationWatcher.checkIsUserInProjectZone();

      if (!isInProjectZone) {
        props.navigation.navigate(AppRoutes.StackModals, {
          screen: ModalsRoutes.Actions,
          params: {
            title: 'Внимание!',
            text: 'Для начала учета времени вы должны находиться в зоне проекта.',
            buttons: [
              {
                haveTopBorder: true,
                children: 'Ок',
                onPress: (navigation, modal) => modal.close(),
              },
            ],
          },
        });
        return;
      }

      await Tracker.start();
    } catch (e) {
      //@ts-ignore
      ToastManager.error(e.error.data.errors);
    } finally {
      setIsStarting(false);
    }
  };

  const fetchBEState = async () => {
    if (projectId !== storedProject?.id) {
      Timer.reset();
    }

    setIsSyncingPersistedState(true);

    try {
      const [res, pauseRes] = await Promise.all([
        WorktimeAPIRaw.getTodayWorktime({
          params: {
            vacancy_id: projectId,
          },
        }),
        WorktimeAPIRaw.getTodayDinner(),
      ]);

      Tracker.syncWithBE(res.data);

      await delay(200);

      Timer.setPause(
        status === EnumTrackerStatus.PAUSED ? new Date().toISOString() : '',
        //@ts-expect-error
        (typeof pauseRes?.data === 'number' ? pauseRes?.data : 0) * 1000,
      );
    } catch (e) {}

    setIsSyncingPersistedState(false);
  };

  useErrorHandler(() => {
    props.navigation.popToTop();
  }, projectScheduleQuery);

  useEffect(() => {
    fetchBEState();

    const subscription = AppState.addEventListener('change', fetchBEState);

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    Crashlytics.log('[SCREEN][TRACKING] Project', `${projectId}`);

    reloadStore();
    fetchBEState();
    __DEVELOPER__ && Clipboard.setString(`${projectId}`);
  }, [isFocused, projectId]);

  useEffect(() => {
    if (projectScheduleQuery.data) {
      dispatch(TrackerActions.setProject(projectScheduleQuery.data));
    }
  }, [projectScheduleQuery.data]);

  return (
    <Layout
      /**
       *Options
       */
      isEnding={isEnding}
      isLoading={projectScheduleQuery.isLoading}
      isPausing={isPausing}
      isStarting={isStarting}
      isTimerLoading={isSyncingPersistedState}
      pauseTimer={pauseTimer}
      project={
        projectScheduleQuery.data ||
        props.route.params?.default ||
        storedProject
      }
      status={status}
      timer={timer}
      /**
       *Methods
       */
      onEnd={onEnd}
      onPause={onPause}
      onStart={onStart}
      {...props}
    />
  );
};

type PassingStates = {};

type PassingProps = {
  isLoading: boolean;
  isTimerLoading: boolean;
  project?: Omit<DTOProjectVacancy, 'lat' | 'lng' | 'radius'>;
  status: EnumTrackerStatus;
  timer: number;

  pauseTimer: number;

  onPause: () => void;
  onEnd: () => void;
  onStart: () => void;

  isEnding: boolean;
  isStarting: boolean;
  isPausing: boolean;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
