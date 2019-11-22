import {usePromise} from "../util/usePromise";
import {default as React} from "react";

export function Value({promise}) {
    const value = usePromise(promise);
    const string = (() => {
        try {
            return value.toString()
        } catch (e) {
            return undefined;
        }
    })();
    return <>{string ? string : '>'}</>;
}