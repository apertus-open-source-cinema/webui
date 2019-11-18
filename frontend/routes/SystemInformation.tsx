import * as React from "react";
import {useState} from "react";
import {useEffect} from "react";
import {exec} from "../exec/exec";

export const text = "System Information";
export const route = "/system_information";
export function Component(props) {
    return (
        <div>
            <PlainCommand command="date" interval={500}/>
            <PlainCommand command="uptime" interval={1000}/>
            <PlainCommand command="free -h" interval={1000}/>
            <PlainCommand command="ip a" interval={1000}/>
            <PlainCommand command="ps -aef --forest" interval={10000}/>
        </div>
    );
}


function PlainCommand(props) {
    const {command, interval} = props;
    const [output, setOutput] = useState(`$ ${command}`);
    useEffect(() => {
        const interval_handle = setInterval(() =>
                exec(command).then(result => setOutput(`$ ${command} \n${result[0]}`))
            , interval);
        return () => clearInterval(interval);
    }, [command]);

    return <pre style={{backgroundColor: '#eee'}}>{output}</pre>
}