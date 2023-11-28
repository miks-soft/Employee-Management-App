import { useEffect, useRef } from 'react';

import { toast } from 'react-hot-toast/src/core/toast';

import { animateLayout, showUnexpectedError } from '#utils';
import Debug from '#utils/debug';
import Vibration from '#utils/vibrations';

const useErrorHandler = (
  cb: (errors: { [x in string]: string }) => void,
  meta: { error?: any },
  firstRenderIgnored = true,
) => {
  const ignoreErrors = useRef(firstRenderIgnored);

  useEffect(() => {
    const { error } = meta;

    if (!error || (firstRenderIgnored && ignoreErrors.current)) {
      ignoreErrors.current = false;
      return;
    }

    Vibration.impactMedium();

    Debug.error('API', error);

    if (!('data' in error)) {
      showUnexpectedError(error);
      return;
    }

    animateLayout();

    if (typeof error.data.errors === 'string') {
      toast(error.data.errors);
      return;
    }

    if (error.data?.errors) {
      cb(error.data.errors);
      return;
    }

    showUnexpectedError(typeof error.data === 'string' ? error.data : error);
    return;
  }, [meta.error]);
};

export default useErrorHandler;
