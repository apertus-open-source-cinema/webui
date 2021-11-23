// SPDX-FileCopyrightText: © 2019 Jaro Habiger <jarohabiger@googlemail.com>
// SPDX-License-Identifier: AGPL-3.0-only

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { NCTRL_BASE_PATH } from '../util/nctrl';
import { Fs } from '../util/fs';
import { usePromiseGenerator } from '../util/usePromiseGenerator';
import { FileContent } from '../components/FileContent';
import { NctrlValueTextfield } from '../components/NctrlValueWidgets';
import { NctrlValue } from '../util/nctrlValue';

export const title = 'Register Explorer';
export const route = '/registers';
export const explanation = `The register explorer allows you to comunicate directly with the
  registers of the peripherals (i.e. the image sensor) of the camera.
  just navigate the displayed tree (by clicking on items with a '>' sign)
  and change the values of all the registers you like.
  
  Especially usefull for development and experimenting, **not so much for production use**.`;

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
    backgroundColor: theme.palette.background.paper,
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
}));

export function Component(props) {
  const classes = useStyles();

  const ref = useRef();
  const scroll_fn = () => {
    if (ref.current !== undefined) {
      ref.current.scrollLeft = 10e10;
    }
  };

  const [active, setActive] = useState([NCTRL_BASE_PATH]);
  const columns = active.map((x, i) => (
    <Column
      key={i}
      path={active.slice(0, i + 1).reduce((a, b) => a + b)}
      setActive={x => {
        if (x === undefined) {
          setActive(active.slice(0, i + 1));
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

  let entries = usePromiseGenerator(() => Fs.of(path).ls(), path);
  useEffect(scrollFn, [entries]);

  if (entries === undefined) {
    return <ListColumn entries={[]} {...props} />;
  } else if (typeof entries === 'string') {
    return <></>;
  } else {
    return <ListColumn entries={entries} {...props} />;
  }
}

function ListColumn(props) {
  const { entries, setActive } = props;
  const classes = useStyles();

  const directories = entries.filter(x => x.type() === 'd');
  const information = entries.filter(x => x.type() === 'f' && !isValue(x));
  const values = entries.filter(x => x.type() === 'f' && isValue(x));

  return (
    <div
      className={classes.column}
      onMouseDown={() => setActive(undefined)}
      onClick={() => setActive(undefined)}
    >
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
            return (
              <li key={x.name()}>
                <NctrlValueTextfield key={x.name()} path={x.path} {...props} />
              </li>
            );
          } else {
            return <NonValueListEntry key={x.name()} entry={x} {...props} />;
          }
        })}
      </ul>
    </>
  );
}

function isValue(x) {
  if (x.type() !== 'f') {
    return false;
  }
  if (x.path.match(/scripts\//)) {
    return ['description', 'value'].every(i => i !== x.name);
  } else {
    return x.name() === 'value';
  }
}

function NonValueListEntry(props) {
  const { entry, active, setActive, path } = props;
  const type = entry.type();
  const name = entry.name();
  const classes = useStyles();

  let right = 'x';
  if (type === 'f') {
    right = <FileContent path={path + name} />;
  } else if (type === 'd') {
    right = '>';
  }

  const onClick = e => {
    if (type === 'd') {
      setActive(name + '/');
      e.stopPropagation();
    }
  };

  return (
    <li
      key={name}
      className={classes.li + (active === name + '/' && type === 'd' ? ' ' + classes.active : '')}
      onMouseDown={onClick}
      onClick={onClick}
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
