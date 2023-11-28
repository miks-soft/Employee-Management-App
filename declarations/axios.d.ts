import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    path?:
      | {
          [key in string]: any;
        }
      | unknown;
  }
}
