import { useEffect } from 'react';

import { useGetCurrentUserQuery } from '#api/controllers/Auth';

import Crashlytics from '#services/Crashlytics';

import { useSelector } from '#store';

export const useWatchDeviceToken = () => {
  const isSignedIn = useSelector(store => store.app.isSignedIn);
  const currentUserQuery = useGetCurrentUserQuery(undefined, {
    skip: !isSignedIn,
  });

  useEffect(() => {
    if (isSignedIn && currentUserQuery.data) {
      Crashlytics.trackLogIn(currentUserQuery.data);
    }
    if (!isSignedIn) {
      Crashlytics.trackLogOut();
    }
  }, []);
};

export default useWatchDeviceToken;
