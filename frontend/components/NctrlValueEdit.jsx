import { default as React, useEffect, useState } from 'react';
import { makeStyles, MenuItem, TextField } from '@material-ui/core';
import { usePromiseGenerator, usePromiseGeneratorRefreshable } from '../util/usePromiseGenerator';

const useStyles = makeStyles(theme => ({
  input: {
    width: '100%',
    padding: '0 5px',
    boxSizing: 'border-box',
    color: theme.palette.text.primary + ' !important',
    '& fieldset': {
      borderColor: theme.palette.text.primary + ' !important',
    },
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

export function NctrlValueTextfield({ nctrlValue }) {
  const classes = useStyles();

  // an inlined version of the usePath hook to be able to refresh the file contents after writing
  const [value, refreshValue] = usePromiseGeneratorRefreshable(
    () => nctrlValue.value(),
    nctrlValue,
    ''
  );

  // state for the textfield
  const [fieldValue, setFieldValue] = useState(undefined);
  useEffect(() => setFieldValue(undefined), [nctrlValue]);
  const is_changed = fieldValue !== undefined && fieldValue !== value;

  const writable =
    usePromiseGenerator(() => nctrlValue.isWritable(), nctrlValue) !== 'false';

  const map = usePromiseGenerator(() => nctrlValue.getMap(), nctrlValue);

  // setting values
  const [error, setError] = useState(undefined);
  useEffect(() => setError(undefined), [nctrlValue]);

  const submit = value => {
    nctrlValue
      .setValue(value)
      .then(() => refreshValue())
      .then(() => setError(undefined))
      .then(() => setFieldValue(undefined))
      .catch(error => setError(error));
  };

  return (
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
  );
}
