import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { makeStyles, MenuItem, TextField, Typography, withStyles } from '@material-ui/core';
import { usePath } from '../util/usePath';
import { cat, get_path, set } from '../util/execCommands';

export const text = 'Register Explorer';
export const route = '/registers';

const column_width = '300px';
const useStyles = makeStyles(theme => ({
  column_container: {
    display: 'flex',
    height: 'calc(100vh - 64px)',
    width: '100%',
    overflowX: 'scroll',
    scrollbarWidth: 'thin',
    scrollbarColor: 'lightgray transparent',
  },
  column: {
    height: '100%',
    overflowY: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: 'lightgray transparent',
    width: column_width,
    borderRight: '1px solid lightgray',
    flexShrink: 0,
    padding: 0,
  },
  ul: {
    listStyle: 'none',
    padding: 0,
  },
  li: {
    padding: '5px 10px',
  },
  list: {
    padding: '0 20px',
  },
  active: {
    background: 'dodgerblue',
    color: 'white',
  },
  entry_right: {
    fontStyle: 'italic',
    color: '#555',
    float: 'right',
  },
  entry_left: {
    maxWidth: '90%',
    overflow: 'hidden',
    display: 'inline-block',
    textOverflow: 'ellipsis',
  },
  item: {
    display: 'inline-block',
    width: '100%',
  },
  input: {
    width: '100%',
    borderColor: 'green',
  },
  changed: {
    '& fieldset': {
      borderColor: '#fcba03 !important',
      borderWidth: 2,
    },
  },
  error: {
    '& fieldset': {
      borderColor: 'red !important',
      borderWidth: 2,
    },
  },
}));

const BASE_PATH = './nctrl_mountpoint/';

export function Component(props) {
  const classes = useStyles();

  const ref = useRef();
  const scroll_fn = () => {
    if (ref.current !== undefined) {
      // @ts-ignore
      ref.current.scrollLeft = 10e10;
    }
  };

  const [active, setActive] = useState([BASE_PATH]);
  const columns = active.map((x, i) => (
    <Column
      key={i}
      path={active.slice(0, i + 1).reduce((a, b) => a + b)}
      setActive={x => {
        if (x === undefined) {
          setActive(active.slice(0, i + 1))
        } else {
          setActive([...active.slice(0, i + 1), x]);
        }
      }}
      active={active[i + 1]}
      scrollFn={scroll_fn}
    />
  ));

  return (
    <div ref={ref} className={classes.column_container}>
      {columns}
    </div>
  );
}

function Column(props) {
  const { path, scrollFn } = props;

  let entries = usePath(path);
  useEffect(scrollFn, [entries]);

  if (entries === undefined) {
    return <ListColumn entries={[]} {...props}/>;
  } else if (typeof entries === 'string') {
    return <></>;
  } else {
    return <ListColumn entries={entries} {...props} />;
  }
}

function ListColumn(props) {
  const { entries, setActive } = props;
  const classes = useStyles();

  const directories = entries.filter(x => x.type === 'd');
  const information = entries.filter(x => x.type === 'f' && !isValue(x));
  const values = entries.filter(x => x.type === 'f' && isValue(x));

  return (
    <div className={classes.column} onPointerDown={() => setActive(undefined)}>
      <List children={values} {...props} />
      <List children={information} {...props} />
      <List children={directories} {...props} />
    </div>
  );
}

function List(props) {
  const { children, title, path } = props;
  const classes = useStyles();

  if (children.length === 0) {
    return <></>;
  }

  return (
    <>
      {title ? <h5 className={classes.li}>{title}</h5> : <></>}
      <ul className={classes.ul}>
        {children.map(x => {
          if (isValue(x)) {
            return <ValueListEntry key={x.name} entry={x} {...props} />;
          } else {
            return <NonValueListEntry key={x.name} entry={x} {...props} />;
          }
        })}
      </ul>
    </>
  );
}

function isValue(x) {
  if (x.type !== 'f') {
    return false;
  }
  if (x.path.match(/scripts\//)) {
    return ['description', 'value'].every(i => i !== x.name);
  } else {
    return x.name === 'value';
  }
}

export function FileContent({ path }) {
  const value = usePath(path);
  return <FutureValue value={value} error={'not readable'}/>;
}

export function FutureValue({ value, error }) {
  if (value === null) {
    return <span style={{ color: 'red' }}>{error}</span>;
  } else if (typeof value === 'string') {
    return value;
  } else {
    return <></>;
  }
}

function NonValueListEntry(props) {
  const { entry, active, setActive, path } = props;
  const { type, name } = entry;
  const classes = useStyles();

  let right: any = 'x';
  if (type === 'f') {
    right = <FileContent path={path + name}/>;
  } else if (type === 'd') {
    right = '>';
  }

  return (
    <li
      key={name}
      className={classes.li + (active === name + '/' && type === 'd' ? ' ' + classes.active : '')}
      onPointerDown={e => {
        if (type === 'd') {
          setActive(name + '/')
          e.stopPropagation();
        }
      }}
    >
      <div className={classes.item}>
        <Typography>
          <span className={classes.entry_left}>{name}</span>
          <span className={classes.entry_right}>{right}</span>
        </Typography>
      </div>
    </li>
  );
}

export function ValueListEntry({ entry }) {
  const classes = useStyles();
  const { path, name } = entry;

  // an inlined version of the usePath hook to be able to refresh the file contents after writing
  const [value, setValue] = useState('');
  useEffect(() => {
    get_path(path).then(v => setValue(v));
  }, [path]);

  // state for the textfield
  const [fieldValue, setFieldValue] = useState(undefined as any);
  useEffect(() => setFieldValue(undefined), [path]);
  const is_changed = fieldValue !== undefined && fieldValue !== value;

  // determine some properties of the value
  const writable = usePath(path.replace(/\/[^\/]*$/, '/writable')) !== 'false';

  // another slightly modified version of usePath
  const [map, setMap] = useState(undefined as any);
  useEffect(() => {
    get_path(path.replace(/\/[^\/]*$/, '/map'))
      .then(async v => {
        if (Array.isArray(v)) {
          return await Promise.all(
            v.map(async entry => ({ representation: entry.name, value: await cat(entry.path) })),
          );
        } else {
          setMap(undefined);
        }
      })
      .then(v => setMap(v));
  }, [path]);

  // setting values
  const [error, setError] = useState(undefined as any);
  useEffect(() => setError(undefined), [path]);
  const submit = value => {
    set(path, value)
      .then(() =>
        get_path(path).then(v => {
          setValue(v);
          setFieldValue(v);
        }),
      )
      .catch(error => setError(error));
  };

  return (
    <li key={name} className={classes.li}>
      <TextField
        label={name}
        select={Array.isArray(map)}
        disabled={!writable}
        value={fieldValue === undefined ? value : fieldValue}
        onChange={event => {
          setFieldValue(event.target.value);
          if (Array.isArray(map)) submit(event.target.value);
        }}
        onKeyDown={event => {
          if (event.key === 'Enter') submit(fieldValue);
        }}
        className={
          classes.input +
          (is_changed ? ` ${classes.changed}` : '') +
          (error ? ` ${classes.error}` : '')
        }
        margin="dense"
        variant="outlined"
      >
        {Array.isArray(map)
          ? map.map(({ value, representation }) => (
            <MenuItem key={representation} value={value}>
              {value} ({representation})
            </MenuItem>
          ))
          : ''}
      </TextField>
    </li>
  );
}
