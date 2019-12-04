import { useEffect, useState } from 'react';
import { get_path } from './execCommands';

export function usePath(path) {
  const [value, setValue] = useState(undefined as any);
  useEffect(() => {
    setValue(undefined);
    get_path(path)
      .then(v => setValue(v))
      .catch(err => setValue(null));
  }, [path]);

  return value;
}
