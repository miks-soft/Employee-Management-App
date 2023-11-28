import { BEError, Query } from '#api';

import FileManager, { InternalFile } from '#services/FileManager';

import { RequestsHelp as Requests } from './types';

const HelpAPI = Query.injectEndpoints({
  endpoints: build => ({
    postImage: build.mutation<
      { data: string; success: boolean },
      Omit<Requests['postImage']['args'], 'data'> & {
        files: InternalFile[];
      }
    >({
      queryFn: async args => {
        try {
          const result = await FileManager.upload(
            '/image/upload',
            {},
            args.files,
            'image',
          );
          const resultJSON = await result.json();
          return { data: resultJSON };
        } catch (e) {
          return { error: e as BEError };
        }
      },
    }),
  }),
});

export const { usePostImageMutation } = HelpAPI;
