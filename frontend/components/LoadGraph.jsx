import React from 'react';
import { Chart } from 'react-charts';

import useDemoConfig from './GraphUtils/useDevConfig';
import ResizableBox from './GraphUtils/ResizableBox';
import { Command } from './CommandWidgets';
import { Box, Typography } from '@material-ui/core';

export default function LoadGraph() {
  const datasets = {
    labels: [],
    data: [{}],
  };

  const { data, updateData } = useDemoConfig({
    series: 3,
  });

  const series = React.useMemo(
    () => ({
      showPoints: true,
    }),
    []
  );

  const axes = React.useMemo(
    () => [
      {
        primary: true,
        type: 'time',
        position: 'bottom',
      },
      { type: 'linear', position: 'left' },
    ],
    []
  );

  return (
    <>
      <Box
        style={{
          padding: '0.5rem',
        }}
      >
        <br />
        <Typography variant="overline" display="block" gutterBottom>
          Camera Load averages
        </Typography>
        <br />

        <ResizableBox
          style={{
            background: 'rgba(0, 27, 45, 0.9)',
            borderRadius: '5px',
            padding: '0.1rem',
          }}
        >
          <Chart data={data} series={series} axes={axes} tooltip dark />
        </ResizableBox>
      </Box>
      <Command command="uptime" interval={2000} updateData={updateData} />
    </>
  );
}
