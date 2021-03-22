import { default as React, useEffect, useState } from 'react';
import { exec } from '../util/exec';

export function Command(props) {
  return (
    <pre style={{ backgroundColor: '#eee', overflowX: 'auto' }}>
      $ {props.command} {`\n`} <PlainCommand {...props} />
    </pre>
  );
}

function extractLoadFromString(str = '') {
  let list = str.split(',').map(ele => {
    return ele.trim();
  });
  let one_min = list[2].split(':')[1];
  let five_min = list[3];
  let fifteen_min = list[4];

  return [
    {
      label: 'One Minute Load',
      data: [
        {
          primary: new Date(),
          secondary: parseFloat(one_min),
        },
      ],
    },
    {
      label: 'Five Minute Load',
      data: [
        {
          primary: new Date(),
          secondary: parseFloat(five_min),
        },
      ],
    },
    {
      label: 'Fifteen Minute Load',
      data: [
        {
          primary: new Date(),
          secondary: parseFloat(fifteen_min),
        },
      ],
    },
  ];
}

export function PlainCommand({ command, interval, children, updateData }) {
  const [output, setOutput] = useState('');
  useEffect(() => {
    const callback = () =>
      exec(command)
        .then(result => {
          setOutput(result[0]);
          if (updateData !== undefined) updateData(extractLoadFromString(result[0]));
        })
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
