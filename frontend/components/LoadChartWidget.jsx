import Chart from 'react-apexcharts';
import React , { useEffect } from 'react';
import ApexCharts from "apexcharts";

const graph_height = 400;

export default function LoadChartWidget(props) {
  const options = {
    chart: {
      height: graph_height,
      type: 'line',
      zoom: {
        enabled: true,
      },
      id:'load_chart'
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
      name : '1 minute',
      data : []
    },
    {
      name : '5 minute',
      data : []
    },
    {
      name : '15 mintue',
      data : []
    }
  ];

  useEffect(() => {
    ApexCharts.exec('load_chart', 'updateOptions', {
      xaxis: {
        labels: {
          show: false
        }
      },
    });

    ApexCharts.exec('load_chart', 'appendData', [
      {
        data: props.data[0]
      },
      {
        data: props.data[1]
      },
      {
        data: props.data[2]
      },

  ]);
  })

  return (
    <div id="chart">
      <Chart options={options} series={series} type="line" height={graph_height} />
    </div>
  );
}