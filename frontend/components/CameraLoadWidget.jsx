import React, { useEffect, useState } from 'react';

import { exec } from '../util/exec';

import Chart from 'react-google-charts';

const CameraLoadWidget = props => {
  const [load, setLoad] = useState([
    ['Time Lapsed(In seconds)', '1 minute avg', '5 minute avg', '15 minute avg'],
    [0, 0, 0, 0],
  ]);
  useEffect(() => {
    let intervalId = setInterval(function a() {
      exec('uptime').then(result => {
        let splitres = String(result)
          .trim()
          .split('load average:')[1]
          .trim()
          .split(',');

        setLoad(oldLoad => {
          let loadArr = [
            [
              oldLoad[oldLoad.length - 1][0] + 1,
              splitres[0].trim(),
              splitres[1].trim(),
              splitres[2].trim(),
            ],
          ];
          return oldLoad.concat(loadArr);
        });
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <p>
      <Chart height={'400px'} chartType="Line" data={load} />
    </p>
  );
};

export default CameraLoadWidget;
