// SPDX-FileCopyrightText: © 2019 Jaro Habiger <jarohabiger@googlemail.com>
// SPDX-License-Identifier: AGPL-3.0-only

import { default as React, useEffect, useState } from 'react';
import { exec } from '../util/exec';

export function Command(props) {
  return (
    <pre style={{ backgroundColor: '#eee', overflowX: 'auto' }}>
      $ {props.command} {`\n`} <PlainCommand {...props} />
    </pre>
  );
}

export function PlainCommand({ command, interval, children }) {
  const [output, setOutput] = useState('');
  useEffect(() => {
    const callback = () =>
      exec(command)
        .then(result => setOutput(result[0]))
        .catch(err => setOutput(err[1]));
    const interval_handle = setInterval(callback, interval);
    callback();
    return () => clearInterval(interval_handle);
  }, [command]);

  if (children === undefined) {
    return <>{output}</>;
  } else if (typeof children === 'function') {
    return children(output);
  } else {
    throw new Error('children of plain command can either be a function or undefined');
  }
}
