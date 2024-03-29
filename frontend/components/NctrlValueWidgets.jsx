// SPDX-FileCopyrightText: © 2019 Jaro Habiger <jarohabiger@googlemail.com>
// SPDX-License-Identifier: AGPL-3.0-only

import { default as React, useEffect, useState } from 'react';
import { Button, makeStyles, MenuItem, TextField, Typography } from '@material-ui/core';
import { usePromiseGenerator, usePromiseGeneratorRefreshable } from '../util/usePromiseGenerator';
import Slider from '@material-ui/core/Slider';
import ArrowLeft from '@material-ui/icons/ArrowBack';
import ArrowRight from '@material-ui/icons/ArrowForward';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { NCTRL_BASE_PATH } from '../util/nctrl';

const useStyles = makeStyles(theme => ({
  input: {
    width: '100%',
    padding: '5px 15px',
    boxSizing: 'border-box',
    color: theme.palette.text.primary + ' !important',
    '& fieldset': {
      borderColor: theme.palette.text.primary + ' !important',
    },
    '& .Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: 'white !important',
    },
    '& .Mui-selected:hover': {
      backgroundColor: '#FF6726',
    },
    '& .MuiToggleButton-root': {
      color: theme.palette.text.primary,
    },
  },
  button: {
    flexGrow: 1,
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
    padding: '50px 25px 10px',
    boxSizing: 'border-box',
  },
  text: {
    textAlign: 'center',
  },
}));

export function NctrlValueTextfield({ path, rerender, rerenderDep }) {
  rerender = rerender || (() => {});

  const classes = useStyles();

  const nctrlValue = NctrlValue.of(path);

  const [value, refreshValue] = usePromiseGeneratorRefreshable(
    () => nctrlValue.value(),
    [nctrlValue, rerenderDep],
    ''
  );

  // state for the textfield
  const [fieldValue, setFieldValue] = useState(undefined);
  useEffect(() => setFieldValue(undefined), [nctrlValue]);
  const is_changed = fieldValue !== undefined && fieldValue !== value;

  const writable = usePromiseGenerator(() => nctrlValue.isWritable(), nctrlValue) !== 'false';

  const map = usePromiseGenerator(() => nctrlValue.getMap(), nctrlValue);

  // setting values
  const [error, setError] = useState(undefined);
  useEffect(() => setError(undefined), [nctrlValue]);

  const submit = value => {
    nctrlValue
      .setValue(value)
      .then(() => refreshValue())
      .then(rerender())
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

export function NctrlValueSlider({ path, options, min, max, integer, rerender, rerenderDep }) {
  const classes = useStyles();

  const valueParser = integer ? parseInt : parseFloat;

  const nctrlValue = NctrlValue.of(path);
  const [value, setValue] = useState(0.0);
  useEffect(() => {
    nctrlValue.value().then(x => setValue(valueParser(x)));
  }, [path, rerenderDep]);

  const MIN_SEND_DELAY = 50; // ms TODO: Maybe adjust this
  const [lastUpdate, setLastUpdate] = useState(0);
  const onChange = (_, newValue) => {
    setValue(newValue);
    const currentTime = +new Date();
    if (lastUpdate + MIN_SEND_DELAY < currentTime && newValue !== value) {
      setLastUpdate(currentTime);
      nctrlValue.setValue(newValue);
    }
  };

  const onChangeCommitted = (e, value) =>
    nctrlValue
      .setValue(value)
      .then(() => nctrlValue.value().then(value => setValue(valueParser(value))))
      .then(rerender());

  const renderLabel = () => {
    if (value > max) {
      return <ArrowRight />;
    } else if (value < min) {
      return <ArrowLeft />;
    } else {
      if (options) {
        return options[value] || value.toFixed(integer || value >= 100 ? 0 : 1);
      } else {
        return value.toFixed(integer || value >= 100 ? 0 : 1);
      }
    }
  };

  if (options) {
    const marks = Object.keys(options).map(key => ({
      value: valueParser(key),
      label: options[key],
    }));

    const value_next_marking = marks
      .map(x => x.value)
      .map(x => ({ dif: Math.abs(x - value), val: x }))
      .reduce((acc, curr) => (curr.dif < acc.dif ? curr : acc), { dif: Infinity }).val;

    const min = Math.min(...marks.map(x => x.value));
    const max = Math.max(...marks.map(x => x.value));

    return (
      <div className={classes.sliderBox}>
        <Slider
          value={value_next_marking}
          onChange={onChange}
          onChangeCommitted={onChangeCommitted}
          aria-labelledby="discrete-slider-restrict"
          valueLabelFormat={renderLabel}
          step={null}
          marks={marks}
          valueLabelDisplay="on"
          min={min}
          max={max}
        />
      </div>
    );
  } else {
    return (
      <div className={classes.sliderBox}>
        <Slider
          marks={[
            { value: min, label: min },
            { value: max, label: max },
          ]}
          value={value}
          onChange={onChange}
          onChangeCommitted={onChangeCommitted}
          valueLabelFormat={renderLabel}
          aria-labelledby="discrete-slider-always"
          valueLabelDisplay="on"
          min={min}
          max={max}
          step={integer ? 1 : 0.001}
        />
      </div>
    );
  }
}

export function NctrlValueButtons({ path, buttons, rerender, rerenderDep }) {
  const classes = useStyles();

  const nctrlValue = NctrlValue.of(path);
  const value = usePromiseGenerator(() => nctrlValue.value(), [nctrlValue, rerenderDep], '');

  // the buttons are a map of label -> (formerValue) => nextValue
  return (
    <ButtonGroup size="large" className={classes.input}>
      {Object.keys(buttons).map(label => {
        const clickFn = eval(buttons[label]);

        return (
          <Button
            className={classes.button}
            key={label}
            id={label}
            onClick={() => nctrlValue.setValue(clickFn(value)).then(rerender)}
          >
            {label}
          </Button>
        );
      })}
    </ButtonGroup>
  );
}

export function NctrlValueSpacing({ px }) {
  return <div style={{ paddingTop: px }} />;
}

export function NctrlValueText({ text }) {
  const classes = useStyles();
  return <Typography className={classes.text}>{text}</Typography>;
}

export function NctrlValueSlopeeditor({ text, rerender, rerenderDeps }) {
  const classes = useStyles();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const showSlopes2 = selectedIndex >= 1 ? 'block' : 'none';
  const showSlopes3 = selectedIndex == 2 ? 'block' : 'none';

  useEffect(
    () => {
      NctrlValue.of(`${NCTRL_BASE_PATH}devices/cmv12000/raw/number_slopes`).setValue(selectedIndex + 1)
    },
    [selectedIndex]
  );

  return (
    <div>
      <ToggleButtonGroup
        className={classes.input}
        value={selectedIndex}
        onChange={(_, value) => {
          if (value != null) setSelectedIndex(value);
        }}
        exclusive
      >
        <ToggleButton
          value={0}
          className={classes.button}
          classes={{
            selected: classes.selected,
          }}
        >
          1 Slope
        </ToggleButton>
        <ToggleButton value={1} className={classes.button}>
          2 Slopes
        </ToggleButton>
        <ToggleButton value={2} className={classes.button}>
          3 Slopes
        </ToggleButton>
      </ToggleButtonGroup>
      <div style={{ display: showSlopes2 }}>
        {NctrlValueSlider({
          path: `${NCTRL_BASE_PATH}devices/cmv12000/computed/exposure_time_kp1_ms`,
          min: 0,
          max: 15,
          rerender,
          rerenderDeps,
        })}
        {NctrlValueText({ text: 'Exposure Time Kneepoint 1' })}
        {NctrlValueSlider({
          path: `${NCTRL_BASE_PATH}devices/cmv12000/cooked/vtfl2`,
          options: {
            64: 'off',
            70: '10 %',
            76: '20 %',
            83: '30 %',
            89: '40 %',
            95: '50 %',
            102: '60 %',
            108: '70 %',
            114: '80 %',
            121: '90 %',
            127: '100 %',
          },
          integer: true,
          rerender,
          rerenderDeps,
        })}
        {NctrlValueText({ text: 'Kneepoint 1 Level' })}
      </div>
      <div style={{ display: showSlopes3 }}>
        {NctrlValueSlider({
          path: `${NCTRL_BASE_PATH}devices/cmv12000/computed/exposure_time_kp2_ms`,
          min: 0,
          max: 15,
          rerender,
          rerenderDeps,
        })}
        {NctrlValueText({ text: 'Exposure Time Kneepoint 2' })}
        {NctrlValueSlider({
          path: `${NCTRL_BASE_PATH}devices/cmv12000/cooked/vtfl3`,
          options: {
            64: 'off',
            70: '10 %',
            76: '20 %',
            83: '30 %',
            89: '40 %',
            95: '50 %',
            102: '60 %',
            108: '70 %',
            114: '80 %',
            121: '90 %',
            127: '100 %',
          },
          integer: true,
          rerender,
          rerenderDeps,
        })}
        {NctrlValueText({ text: 'Kneepoint 2 Level' })}
      </div>
    </div>
  );
}
