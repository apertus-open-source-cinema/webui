import Chart from 'react-apexcharts';
import React from 'react';

const graph_height = 400;

export default function LoadChartWidget(props) {
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
    xaxis: {
      type: 'time',
      labels: {
        show: false,
      },
      categories : props.labels
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
