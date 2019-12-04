import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { exec } from '../util/exec';

export const title = 'System Information';
export const route = '/system_information';
export const explanation =
  `Get an overview of whats going on in the linux side of your camera. 
  Ip address, system load, etc can be found here`;

export function Component(props) {
  return (
    <div>
      <Command command="date" interval={1000} />
      <Command command="uptime" interval={1000} />
      <Command command="free -h" interval={1000} />
      <Command command="ip a" interval={1000} />
      <Command command="uname -a" interval={10000} />
      <Command command="ps -aef --forest" interval={10000} />
    </div>
  );
}

export function Command(props) {
  return <pre style={{ backgroundColor: '#eee', overflowX: 'auto' }}>$ {props.command} {`\n`} <PlainCommand {...props}/></pre>;
}

export function PlainCommand({ command, interval }) {
  const [output, setOutput] = useState('');
  useEffect(() => {
    const callback = () => exec(command)
      .then(result => setOutput(result[0]))
      .catch(err => setOutput(err[1]));
    const interval_handle = setInterval(callback, interval);
    callback();
    return () => clearInterval(interval_handle);
  }, [command]);

  return <>{output}</>;
}

