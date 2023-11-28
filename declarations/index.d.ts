type paths = import('./../generated/api').paths;
declare module '*.png' {
  const value: any;
  export = value;
}

declare module '#env' {
  const API_URL: string;
  const BASE_URL: string;
  const WEBSOCKET_URL: string;

  export { API_URL, BASE_URL, WEBSOCKET_URL };
}

type text = string | number;

declare type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
declare type SetStateArg<T> = React.SetStateAction<T>;

declare type getSetStateProps<T> = Required<{
  [K in keyof T as K extends string ? `set${Capitalize<K>}` : never]: SetState<
    T[K]
  >;
}>;

declare type PickApiData<T extends keyof paths, U extends keyof paths[T]> = {
  response: paths[T][U]['responses']['200']['content']['application/json']['data'];
  args: paths[T][U]['parameters']['path'] extends Object
    ? {
        path: paths[T][U]['parameters']['path'];
      }
    : undefined & paths[T][U]['parameters']['query'] extends Object
    ? {
        params?: paths[T][U]['parameters']['query'];
      }
    : undefined &
        paths[T][U]['requestBody']['content']['application/json'] &
        paths[T][U]['requestBody']['content']['multipart/form-data'] extends Object
    ? {
        data: paths[T][U]['requestBody']['content']['application/json'] &
          paths[T][U]['requestBody']['content']['multipart/form-data'];
      }
    : void;
};

declare type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
