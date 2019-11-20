import {default as React, useEffect, useState} from "react";
import {exec} from "../exec/exec";

export function PlainCommand(props) {
    const {command, interval} = props;
    const [output, setOutput] = useState(`$ ${command}`);
    useEffect(() => {
        const callback = () => exec(command).then(result => setOutput(`$ ${command} \n${result[0]}`));
        const interval_handle = setInterval(callback, interval);
        callback();
        return () => clearInterval(interval_handle);
    }, [command]);

    return <pre style={{backgroundColor: '#eee'}}>{output}</pre>
}

export function Value(props) {
    const {path} = props;
    const [value, setValue] = useState("");
    useEffect(() => {
        exec(`cat "${path}"`).then(([stdout, stderr]) => setValue(stdout));
    }, [path]);

    return <>{value}</>;
}