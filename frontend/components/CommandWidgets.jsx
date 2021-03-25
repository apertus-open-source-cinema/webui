import React from 'react';

export function Command({ command, output, children }) {
  return (
    <pre style={{ backgroundColor: '#eee', overflowX: 'auto' }}>
      $ {command} {`\n`} <PlainCommand children={children} output={output} />
    </pre>
  );
}

export function PlainCommand({ children, output }) {
  if(!output)
    return null;
    
  if (children === undefined) {
    return <>{output}</>;
  } else if (typeof children === 'function') {
    return children(output);
  } else {
    throw new Error('children of plain command can either be a function or undefined');
  }
}
