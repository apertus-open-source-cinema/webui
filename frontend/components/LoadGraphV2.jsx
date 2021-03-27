import React, { useEffect } from 'react';
import { CanvasJSChart } from 'canvasjs-react-charts';
import { Box } from '@material-ui/core';

const command = 'uptime';
const dataPoints1 = [];
const dataPoints2 = [];
const dataPoints3 = [];
const updateInterval = 1000;

//initial values
var xValue = 0;
var yValue1 = 0;
var yValue2 = 0;
var yValue3 = 0;

export default function LoadGraphV2(props) {
  let chart = {};
  const options = {
    zoomEnabled: true,
    theme: 'light1',
    title: {
      text: 'Load averages',
    },
    axisX: {
      title: 'Seconds',
    },
    axisY: {},
    toolTip: {
      shared: true,
    },
    legend: {
      cursor: 'pointer',
      verticalAlign: 'top',
      fontSize: 18,
      fontColor: 'dimGrey',
      itemclick: toggleDataSeries,
    },
    data: [
      {
        type: 'spline',
        xValueFormatString: '#,##0 seconds',
        showInLegend: true,
        name: '1 minute',
        dataPoints: dataPoints1,
      },
      {
        type: 'spline',
        xValueFormatString: '#,##0 seconds',
        showInLegend: true,
        name: '5 minute',
        dataPoints: dataPoints2,
      },
      {
        type: 'spline',
        xValueFormatString: '#,##0 seconds',
        showInLegend: true,
        name: '15 minute',
        dataPoints: dataPoints3,
      },
    ],
  };

  useEffect(() => {
    const callback = () =>
      exec(command)
        .then(result => {
          updateChart(extractLoadFromString(result[0]));
        })
        .catch(err => console.log(err[1]));
    const interval_handle = setInterval(callback, updateInterval);
    callback();
    return () => clearInterval(interval_handle);
  }, []);

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

  function toggleDataSeries(e) {
    if (typeof e.dataSeries.visible === 'undefined' || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    chart.render();
  }

  function updateChart(data) {
    yValue1 = data.y_value[0];
    yValue2 = data.y_value[1];
    yValue3 = data.y_value[2];
    dataPoints1.push({
      x: xValue,
      y: yValue1,
    });
    dataPoints2.push({
      x: xValue,
      y: yValue2,
    });
    dataPoints3.push({
      x: xValue,
      y: yValue3,
    });
    xValue += 1;
    chart.options.data[0].legendText = ' 1 minute - ' + yValue1;
    chart.options.data[1].legendText = ' 5 minute - ' + yValue2;
    chart.options.data[2].legendText = ' 15 minute - ' + yValue3;

    chart.render();
  }
  return (
    <Box
      style={{
        padding: '1.5rem',
      }}
    >
      <CanvasJSChart options={options} onRef={ref => (chart = ref)} />
    </Box>
  );
}
