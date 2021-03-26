import Chart from 'react-apexcharts';
import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';

const graphHeight = 400;

export default function LoadChartWidget(props) {
  const options = {
    redrawOnWindowResize: false,
    redrawOnParentResize: false,
    chart: {
      height: graphHeight,
      type: 'line',
      zoom: {
        enabled: true,
      },
      id: 'load_chart',
    },
    noData : {
      text : 'Loading...',
      align : 'center',
      verticalAlign : 'middle'
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
      data: [],
    },
    {
      name: '5 minute',
      data: [],
    },
    {
      name: '15 minute',
      data: [],
    },
  ];

  useEffect(() => {

    ApexCharts.exec('load_chart', 'updateOptions', {
      xaxis: {
        labels: {
          show: false
        },
        axisTicks : {
          show : false
        },
        categories : props.labels
      },

    });

    ApexCharts.exec('load_chart', 'appendData', [
      {
        data: props.data[0],
      },
      {
        data: props.data[1],
      },
      {
        data: props.data[2],
      },
    ]);
  });

  return (
      <Chart options={options} series={series} type="line" height={graphHeight} />
  );
}
