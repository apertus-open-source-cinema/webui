import { Box } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Command } from './CommandWidgets';
import LoadChartWidget from './LoadChartWidget';

const uptime_cmd = 'uptime';

const graph_title = 'Load average';

export default function RunCommand(props) {
  const [state, setstate] = useState({
    labels: [],
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
      x_value: new Date(),
      y_value: [one_min, five_min, fifteen_min],
      original_str: str,
    };
  }

  function updateData(new_data) {
    
    setstate(prevstate => ({
      labels: [...prevstate.labels, new_data.x_value],
      data: [
        [new_data.y_value[0]],
        [new_data.y_value[1]],
        [new_data.y_value[2]],
      ],
      output: new_data.original_str,
    }));
  }

  useEffect(() => {
    const callback = () =>
      exec(props.command)
        .then(result => {
          if (props.showGraph) updateData(extractLoadFromString(result[0]));
          else
            setstate(prevState => ({
              ...prevState,
              output: result[0],
            }));
        })
        .catch(err => console.log(err[1]));
    const interval_handle = setInterval(callback, props.interval);
    callback();
    return () => clearInterval(interval_handle);
  }, [props.command]);

  return (
    <div>
      {(props.showGraph !== undefined && props.command === uptime_cmd)? (
        <Box
          style={{
            padding: '1.5rem',
          }}
        >
          <LoadChartWidget labels={state.labels} data={state.data} title={graph_title} />
        </Box>
      ) : null}

      <Command command={props.command} output={state.output} children={props.children} />
    </div>
  );
}
