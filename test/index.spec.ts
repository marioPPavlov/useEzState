import useEzState from '../src';
import { renderHook, act } from '@testing-library/react';

test('updating single property should update only specified property in the state', () => {
  const { result } = renderHook(() =>
    useEzState({
      name: 'John',
      lastName: 'Doe',
    })
  );

  act(() => {
    result.current[1]({ name: 'Jane' });
  });

  expect(result.current[0].name).toBe('Jane');
  expect(result.current[0].lastName).toBe('Doe');
});

test('updating multiple properties should  update only specified properties in the state', () => {
  const { result } = renderHook(() =>
    useEzState({
      name: 'John',
      lastName: 'Doe',
      hairColor: 'brown',
    })
  );

  act(() => {
    result.current[1]({ name: 'Jane', lastName: 'Smith' });
  });

  expect(result.current[0].name).toBe('Jane');
  expect(result.current[0].lastName).toBe('Smith');
  expect(result.current[0].hairColor).toBe('brown');
});

test('update function should always be memoized between rerenders', () => {
  const hook = renderHook(() =>
    useEzState({
      name: 'John',
    })
  );

  const [, updateFunc] = hook.result.current;

  act(() => {
    updateFunc && updateFunc({ name: 'Jane' });
  });
  hook.rerender();

  const [, newUpdateFunc] = hook.result.current;

  expect(updateFunc).not.toBeUndefined();
  expect(updateFunc).toBe(newUpdateFunc);
});

test('update function should always uses latest provided reducer on rerender', () => {
  const reducer1 = () => ({
    name: 'reducer1',
  });
  const reducer2 = () => ({
    name: 'reducer2',
  });

  const hook = renderHook((props: Parameters<typeof useEzState>) => useEzState(...props), {
    initialProps: [{ name: 'John' }, reducer1],
  });

  //check if reducer1 is used
  const [, updateFunc] = hook.result.current;
  act(() => {
    updateFunc && updateFunc({});
  });
  const value = hook.result.current[0].name;
  expect(value).toBe('reducer1');

  //rerender providing new reducer - reducer2 and check if it is used
  hook.rerender([{}, reducer2]);
  const [, newUpdateFunc] = hook.result.current;
  act(() => {
    newUpdateFunc && newUpdateFunc({});
  });

  const newValue = hook.result.current[0].name;
  expect(newValue).toBe('reducer2');
  expect(updateFunc).toBe(newUpdateFunc);
});

test("useEzState's update function should be able to derive state via an update function similar to React.useState", () => {
  const { result } = renderHook(() =>
    useEzState({
      value: 2,
    })
  );

  act(() => {
    result.current[1](({ value }) => ({
      value: value + 2,
    }));
    result.current[1](({ value }) => ({
      value: value + 2,
    }));
  });

  expect(result.current[0].value).toBe(6);
});

test('useEzState should provide method to reset the state', () => {
  const { result } = renderHook(() =>
    useEzState({
      age: 10,
      name: 'Daniel',
    })
  );

  act(() => {
    result.current[1]({
      age: 20,
      name: 'John',
    });
  });

  const resetState = result.current[2];

  act(() => {
    resetState();
  });

  expect(result.current[0].age).toBe(10);
  expect(result.current[0].name).toBe('Daniel');
});
