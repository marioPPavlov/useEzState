import React from 'react';

type UpdateFuncParamter<T> = Partial<T> | ((prev: T) => Partial<T>);

/**
 * A custom hook that provides a state and a function to update it.
 * The update function accepts a partial state object or a function that returns a partial state object.
 * Intended to be used as an alternative for React.useState when you have too many state variables.
 *
 * Best used with TypeScript as it provides type safety for the state object.
 * Recommended to set the the flag `"exactOptionalPropertyTypes": true` in your tsconfig.json to ensure the finest type safety.
 *
 * @param initialState The initial state.
 * @param reducer A optional function that accepts the current and next state then returns a new state.
 * @returns A tuple with the state and the update function.
 * @example
 * const [{name, lastName}, update] = useEzState({ name: 'John', lastName: 'Doe' });
 * update({ name: 'Jane' });
 * console.log(name); // Jane
 * console.log(lastName); // Doe
 */
export const useEzState = <T extends Record<string, unknown>>(
  initialState: T,
  reducer = (prev: T, next: Partial<T>) => ({ ...prev, ...next })
): readonly [T, (next: UpdateFuncParamter<T>) => void] => {
  const [state, setState] = React.useState(initialState);
  const reducerRef = React.useRef(reducer);
  reducerRef.current = reducer;

  const update = React.useCallback((next: UpdateFuncParamter<T>) => {
    if (typeof next === 'function') {
      setState(prev => reducerRef.current(prev, next(prev)));
      return;
    }

    setState(state => reducerRef.current(state, next));
  }, []);

  return [state, update] as const;
};