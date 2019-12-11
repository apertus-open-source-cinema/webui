import { useEffect, useState } from 'react';

/**
 * @param pg The promise generator (a function that returns a promise).
 * @param dependencies is to make clear, when the function should be reevaluated
 * @param startValue the default value of the hook
 * @returns the value of the promise. before undefined. null if the promise failed
 */
export function usePromiseGenerator(pg, dependencies, startValue) {
  if (dependencies === undefined) {
    console.warn(`dependencies is undefined. YOU PROBABLY dont want this`);
    console.trace('trace: ');
  }

  if (!pg.toString().startsWith('() =>')) {
    console.warn(`pg should be a closure. instead it is:`);
    console.warn(pg.toString());
    console.trace('trace: ');
  }

  const deps = [pg.toString(), JSON.stringify(dependencies)];
  // use "value gating" to fix react fuckup :(
  const [lastDeps, setLastDeps] = useState(deps);

  const [value, setValue] = useState(startValue);
  useEffect(() => {
    setValue(startValue);
    try {
      pg()
        .then(v => setValue(v))
        .catch(err => {
          console.error(
            `promise generator ${pg.toString()}\n\nwith dependencies ${JSON.stringify(
              dependencies
            )}\n\nresolved error: `,
            err
          );
          setValue(startValue);
        });
    } catch (e) {
      console.error(
        `promise generator ${pg.toString()}\n\nwith dependencies ${JSON.stringify(
          dependencies
        )}\n\nexploded: `,
        e
      );
    }

    setLastDeps(deps);
  }, deps);

  return JSON.stringify(lastDeps) === JSON.stringify(deps) ? value : startValue;
}

export function usePromiseGeneratorRefreshable(pg, dependencies, startValue) {
  const [refreshTimes, setRefreshTimes] = useState(0);
  const refresh = () => setRefreshTimes(refreshTimes + 1);

  const [lastValue, setLastValue] = useState(startValue);

  const promiseVal = usePromiseGenerator(pg, { ...dependencies, refreshTimes });
  useEffect(() => {
    if (promiseVal !== undefined) {
      setLastValue(promiseVal);
    }
  }, [promiseVal]);
  return [promiseVal !== undefined ? promiseVal : lastValue, refresh];
}
