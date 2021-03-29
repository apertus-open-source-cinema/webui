import Chart from 'chart.js';
import React, { createRef, useEffect } from 'react';
import 'chartjs-plugin-zoom';
import { Button } from '@material-ui/core';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import { blue, green, orange } from '@material-ui/core/colors';

var chart = null;
const update_interval = 1000;
const command = 'uptime';
const chart_title = 'Load Averages';
const chart_config = {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: '1 minute',
        data: [],
        backgroundColor: ['rgba(255, 100, 100, 0.1)'],
        borderColor: [orange.A100],
        borderWidth: 1.5,
      },
      {
        label: '5 minute',
        data: [],
        backgroundColor: ['rgba(50, 255, 50, 0.1)'],
        borderColor: [green.A100],
        borderWidth: 1.5,
      },
      {
        label: '15 minute',
        data: [],
        backgroundColor: ['rgba(100, 100, 255, 0.1)'],
        borderColor: [blue.A100],
        borderWidth: 1.5,
      },
    ],
  },
  options: {
    title: {
      display: true,
      text: chart_title,
    },
    hover: {
      animationDuration: 0,
    },
    responsiveAnimationDuration: 0,
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 50,
      },
      x: {
        type: 'time',
        time: {
          unit: 'second',
        },
      },
    },
    elements: {
      line: {
        tension: 0,
      },
    },
    tooltips: {
      mode: 'x',
    },
    plugins: {
      zoom: {
        zoom: {
          enabled: true,
          mode: 'x',
        },
        pan: {
          enabled: true,
          mode: 'x',
        },
      },
    },
  },
};

export default function LoadGraph() {
  const chartRef = createRef();

  function updateData(obj) {
    if (chart == null) return;
    chart.data.labels.push(obj.x_value);
    chart.data.datasets.forEach((dataset, idx) => {
      dataset.data.push(obj.y_value[idx]);
    });
    chart.update();
  }

  function extractLoadFromString(str = '') {
    let list = str.split(',');
    let time_stamp = list[0].trim();
    let one_min = parseFloat(list[2].split(':')[1]);
    let five_min = parseFloat(list[3]);
    let fifteen_min = parseFloat(list[4]);

    return {
      x_value: time_stamp,
      y_value: [one_min, five_min, fifteen_min],
      original_str: str,
    };
  }

  useEffect(() => {
    chart = new Chart(chartRef.current, chart_config);

    const callback = () =>
      exec(command)
        .then(result => {
          updateData(extractLoadFromString(result[0]));
        })
        .catch(err => console.log(err[1]));
    const interval_handle = setInterval(callback, update_interval);
    callback();
    return () => clearInterval(interval_handle);
  }, []);

  function resetZoom() {
    console.log('hello');
    if (chart == null) {
      console.log('Chart is not defined/initialized');
      return;
    }
    chart.resetZoom();
  }

  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        size="small"
        onClick={resetZoom}
        style={{
          margin: '0.5rem',
        }}
        endIcon={<RotateLeftIcon />}
      >
        Reset Zoom
      </Button>
      <canvas ref={chartRef} id="myChart" width="400" height="200"></canvas>
    </div>
  );
}
