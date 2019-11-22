import {useEffect, useState} from "react";

/**
 * A React Hook for using promises returned from async functions
 * @param promise the promise to use
 * @returns {the resolved value of the promise (before: undefined)}
 */
export function usePromise (promise) {
    const [value, setValue] = useState(undefined);
    useEffect(() => {
        promise.then(v => setValue(v));
    }, [promise]);

    return value;
}
