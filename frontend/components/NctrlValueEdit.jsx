import { default as React, useEffect, useState } from 'react';
import { makeStyles, MenuItem, TextField } from '@material-ui/core';
import { usePromiseGenerator, usePromiseGeneratorRefreshable } from '../util/usePromiseGenerator';
import Slider from '@material-ui/core/Slider';

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
  sliderBox: {
    padding: '50px 15px 10px',
    boxSizing: 'border-box',
  }
}));

export function NctrlValueTextfield({ nctrlValue }) {
  const classes = useStyles();

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

export function NctrlValueSlider({ nctrlValue, options }) {
  const classes = useStyles();

  const [value, refreshValue] = usePromiseGeneratorRefreshable(
    () => nctrlValue.value(),
    nctrlValue,
    null
  );

  const marks = Object.keys(options).map(key => ({value: parseFloat(key), label: options[key]}));

  const value_next_marking = marks
    .map(x => x.value)
    .map(x => ({dif: Math.abs(x - value), val: x}))
    .reduce((acc, curr) => curr.dif < acc.dif ? curr : acc, {dif: Infinity})
    .val;

  return (
    <div className={classes.sliderBox}>
      <Slider
        value={value_next_marking}
        onChange={(e, value) => nctrlValue.setValue(value).then(() => refreshValue()).catch(e => console.error(e))}
        aria-labelledby="discrete-slider-restrict"
        getAriaLabel={i => marks[i].label}
        step={null}
        marks={marks}
        valueLabelDisplay="on"
        min={Math.min(...marks.map(x => x.value))}
        max={Math.max(...marks.map(x => x.value))}
      />
    </div>
  );
}