import React, { useEffect, useRef } from 'react';
import Dygraph from 'dygraphs';
import { Container, makeStyles, Paper } from '@material-ui/core';
import { blue, green, red } from '@material-ui/core/colors';
import { Alert } from '@material-ui/lab';

const update_interval = 1000;
const command = 'uptime';
const chart_title = 'Load averages';

const chart_config = {
  legend: 'always',
  labelsSeparateLines: true,
  colors: [red.A200, green.A200, blue.A200],
  strokeWidth: 1.5,
  xlabel: 'Time',
  xLabelHeight: 16,
  title: chart_title,
};

const useStyles = makeStyles(theme => ({
  chart_paper: {
    height: '350px',
    margin: theme.spacing(2),
    padding: theme.spacing(2),
  },
  chart: {
    width: '100%',
    height: '100%',
  },
  box_wrapper: {
    width: '100%',
    marginBottom: theme.spacing(4),
    fontFamily: theme.typography.fontFamily,
  },
  tooltip: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
  },
}));

let data = 'date, 1 minute, 5 minute, 15 minute\n';
let chart = null;

export default function LoadGraph(props) {
  const chartRef = useRef();
  const tooltip_ref = useRef();
  const classes = useStyles();

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
        .catch(err => {
          <Alert severity="error">{err[1]}</Alert>;
          console.log(err[1]);
        });
    const interval_handle = setInterval(
      callback,
      props.interval ? props.interval : update_interval
    );
    callback();
    return () => clearInterval(interval_handle);
  }, []);

  return (
    <Container className={classes.box_wrapper}>
      <Paper className={classes.chart_paper} variant="outlined">
        <div ref={chartRef} className={classes.chart} />
      </Paper>
      <Paper className={classes.tooltip} variant="outlined">
        <div ref={tooltip_ref} />
      </Paper>
    </Container>
  );
}
