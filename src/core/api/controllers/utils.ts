import _ from 'lodash';

export const paginationShouldForceRefetch = (
  args: any & {
    currentArg: {
      params?: {
        page: number;
      } & any;
    };
    previousArg: {
      params?: any;
    };
  },
) =>
  !_.isEqual(args.currentArg?.params, args.previousArg?.params) ||
  args.currentArg?.params?.page === 1;

export const paginationMerge = (
  currentCache: any & { data?: any[] },
  newItems: any & { data?: any[]; current_page: number },
) => {
  if (newItems.current_page !== 1) {
    newItems.data = [...(currentCache.data || []), ...(newItems.data || [])];
  }

  return newItems;
};
