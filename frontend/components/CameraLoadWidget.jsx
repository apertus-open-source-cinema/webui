import React, { useEffect, useState } from 'react';

import { exec } from '../util/exec';

import Bar from '../util/Bar';

const CameraLoadWidget = props => {
  let [load, setLoad] = useState([0, 0, 0]);
  useEffect(() => {
    setInterval(() => {
      exec('uptime').then(result => {
        let splitres = String(result)
          .trim()
          .split('load average:')[1]
          .trim()
          .split(',');

        let loadArr = [
          { index: 0, date: 0, value: splitres[0].trim() },
          { index: 1, date: 1, value: splitres[1].trim() },
          { index: 2, date: 2, value: splitres[2].trim() },
        ];

        setLoad(loadArr);
      });
    }, 1000);
  }, []);

  return (
    <p>
      <Bar data={load} width={300} height={200} top={20} bottom={30} left={30} right={0} />
    </p>
  );
};

export default CameraLoadWidget;
