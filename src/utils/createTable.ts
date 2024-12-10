export const createTable = {
  basedOn: <T extends readonly string[]>(...props: T) => {
    withStateOf: <S extends Record<T[number], unknown>>(state: S) => {

    };
  },
};
