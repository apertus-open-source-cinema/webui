import React, { useEffect, useRef } from 'react';
import Dygraph from 'dygraphs';
import { Box } from '@material-ui/core';
import { blue, green, red } from '@material-ui/core/colors';

const update_interval = 1000;
const command = 'uptime';
const chart_title = 'Load Averages';
const chart_config = {
  legend: 'always',
  labelsSeparateLines: true,
  colors: [red.A200, green.A200, blue.A200],
  strokeWidth: 1.5,
  title: chart_title,
  titleHeight: 24,
  xlabel: 'Time(s)',
  xLabelHeight: 16,
};
const chartStyles = {
  tooltip: {
    margin: '0.5rem',
    flex: 1,
    width: '100%',
  },
  chart: {
    width: '100%',
    height: '350px',
    flex: 5,
  },
  box_wrapper: {
    margin: '1rem',
    marginBottom: '1.5rem',
    display: 'flex',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
};

let data = 'date, 1 minute, 5 minute, 15 minute\n';
let chart = null;

export default function LoadGraph(props) {
  const chartRef = useRef();
  const tooltip_ref = useRef();

  function addData(str = '') {
    if (str.length == 0) return;
    const list = str.split('load average: ');
    data += `${new Date()}, ${list[1].trim()}\n`;
    const row = chart.getSelection();
    chart.updateOptions({ file: data });
    chart.setSelection(row);
  }

  useEffect(() => {
    chart = new Dygraph(chartRef.current, data, {
      ...chart_config,
      labelsDiv: tooltip_ref.current,
    });

    const callback = () =>
      exec(command)
        .then(result => {
          addData(result[0]);
        })
        .catch(err => console.log(err[1]));
    const interval_handle = setInterval(
      callback,
      props.interval ? props.interval : update_interval
    );
    callback();
    return () => clearInterval(interval_handle);
  }, []);

  return (
    <Box style={chartStyles.box_wrapper}>
      <div ref={chartRef} style={chartStyles.chart} />
      <div ref={tooltip_ref} style={chartStyles.tooltip} />
    </Box>
  );
}
