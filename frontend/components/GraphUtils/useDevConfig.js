import React, { useEffect, useState } from 'react';

const options = {
  elementType: ['line', 'area', 'bar', 'bubble'],
  primaryAxisType: ['linear', 'time', 'log', 'ordinal'],
  secondaryAxisType: ['linear', 'time', 'log', 'ordinal'],
  primaryAxisPosition: ['top', 'left', 'right', 'bottom'],
  secondaryAxisPosition: ['top', 'left', 'right', 'bottom'],
  secondaryAxisStack: [true, false],
  primaryAxisShow: [true, false],
  secondaryAxisShow: [true, false],
  grouping: ['single', 'series', 'primary', 'secondary'],
  tooltipAnchor: [
    'closest',
    'top',
    'bottom',
    'left',
    'right',
    'center',
    'gridTop',
    'gridBottom',
    'gridLeft',
    'gridRight',
    'gridCenter',
    'pointer',
  ],
  tooltipAlign: [
    'auto',
    'top',
    'bottom',
    'left',
    'right',
    'topLeft',
    'topRight',
    'bottomLeft',
    'bottomRight',
    'center',
  ],
  snapCursor: [true, false],
};

const optionKeys = Object.keys(options);

export default function useChartConfig({
  series,
  useR,
  show = [],
  count = 1,
  resizable = true,
  canRandomize = false,
  dataType = 'time',
  elementType = 'line',
  primaryAxisType = 'time',
  secondaryAxisType = 'linear',
  primaryAxisPosition = 'bottom',
  secondaryAxisPosition = 'left',
  primaryAxisStack = false,
  secondaryAxisStack = true,
  primaryAxisShow = true,
  secondaryAxisShow = true,
  tooltipAnchor = 'closest',
  tooltipAlign = 'auto',
  grouping = 'primary',
  snapCursor = true,
  datums = 10,
}) {
  const [state, setState] = useState({
    count,
    resizable,
    canRandomize,
    dataType,
    elementType,
    primaryAxisType,
    secondaryAxisType,
    primaryAxisPosition,
    secondaryAxisPosition,
    primaryAxisStack,
    secondaryAxisStack,
    primaryAxisShow,
    secondaryAxisShow,
    tooltipAnchor,
    tooltipAlign,
    grouping,
    snapCursor,
    datums,
    data: [
      {
        label: 'One Minute Load',
        data: [],
      },
      {
        label: 'Five Minute Load',
        data: [],
      },
      {
        label: 'Fifteen Minute Load',
        data: [],
      },
    ],
  });

  useEffect(() => {
    setState(old => ({
      ...old,
      data: state.data,
    }));
  }, [count, dataType, datums, series, useR]);

  const updateData = new_data => {
    if (new_data === undefined) return null;

    const temp_data = state;
    temp_data.data = temp_data.data.map((ele, i) => {
      return {
        label: new_data[i].label,
        data: ele.data.concat(new_data[i].data),
      };
    });

    setState(old => ({
      ...old,
      data: temp_data.data,
    }));
  };

  const Options = optionKeys
    .filter(option => show.indexOf(option) > -1)
    .map(option => (
      <div key={option}>
        {option}: &nbsp;
        <select
          value={state[option]}
          onChange={({ target: { value } }) =>
            setState(old => ({
              ...old,
              [option]: typeof options[option][0] === 'boolean' ? value === 'true' : value,
            }))
          }
        >
          {options[option].map(d => (
            <option value={d} key={d.toString()}>
              {d.toString()}
            </option>
          ))}
        </select>
        <br />
      </div>
    ));

  return {
    ...state,
    updateData,
    Options,
  };
}
