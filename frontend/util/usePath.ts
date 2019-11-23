import { useEffect, useState } from 'react';
import { get_path } from './execCommands';

export function usePath(path) {
  const [value, setValue] = useState(undefined);
  useEffect(() => {
    get_path(path).then(v => setValue(v));
  }, [path]);

  return value;
}
