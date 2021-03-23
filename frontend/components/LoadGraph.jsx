import { Box } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const command = 'uptime';
const interval = 1000;
const graph_height = 400;
const graph_title = 'Load average';

export default function LoadGraph() {
  const [state, setstate] = useState({
    data: [[], [], []],
    output: '',
  });

  function extractLoadFromString(str = '') {
    let list = str.split(',').map(ele => {
      return ele.trim();
    });

    let one_min = parseFloat(list[2].split(':')[1]);
    let five_min = parseFloat(list[3]);
    let fifteen_min = parseFloat(list[4]);

    return {
      y_value: [one_min, five_min, fifteen_min],
      original_str: str,
    };
  }

  function updateData(new_data) {
    setstate(prevstate => ({
      data: [
        [...prevstate.data[0], new_data.y_value[0]],
        [...prevstate.data[1], new_data.y_value[1]],
        [...prevstate.data[2], new_data.y_value[2]],
      ],
      output: new_data.original_str,
    }));
  }

  useEffect(() => {
    const callback = () =>
      exec(command)
        .then(result => {
          updateData(extractLoadFromString(result[0]));
        })
        .catch(err => console.log(err[1]));
    const interval_handle = setInterval(callback, interval);
    callback();
    return () => clearInterval(interval_handle);
  }, []);

  return (
    <>
      <Box
        style={{
          padding: '1.5rem',
        }}
      >
        <LoadChart data={state.data} title={graph_title} />
      </Box>

      <pre style={{ backgroundColor: '#eee', overflowX: 'auto' }}>
        $ {command} {`\n`} {state.output}
      </pre>
    </>
  );
}

function LoadChart(props) {
  const options = {
    chart: {
      height: graph_height,
      type: 'line',
      zoom: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    title: {
      text: props.title,
    },
    stroke: {
      width: 2,
      curve: 'smooth',
    },
    colors: ['#2E93fA', '#66DA26', '#546E7A'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: true,
        gradientToColors: ['#ff0fd7', '#b7ff00', '#0841ff'],
        opacityFrom: 1,
        opacityTo: 1,
        type: 'vertical',
        stops: [0, 30],
      },
    },
  };

  const series = [
    {
      name: '1 minute',
      data: props.data[0],
    },
    {
      name: '5 minute',
      data: props.data[1],
    },
    {
      name: '15 minute',
      data: props.data[2],
    },
  ];

  return (
    <div id="chart">
      <Chart options={options} series={series} type="line" height={graph_height} />
    </div>
  );
}
