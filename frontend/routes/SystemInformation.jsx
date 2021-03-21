import * as React from 'react';
import { Command } from '../components/CommandWidgets';
import LoadGraph from '../components/LoadGraph';

export const title = 'System Information';
export const route = '/system_information';
export const explanation = `Get an overview of whats going on in the linux side of your camera. 
  Ip address, system load, etc can be found here`;

export function Component(props) {
  return (
    <div>
      <LoadGraph />
      <Command command="date" interval={1000} />
      <Command command="free -h" interval={1000} />
      <Command command="ip a" interval={1000} />
      <Command command="uname -a" interval={10000} />
      <Command command="ps -aef --forest" interval={10000} />
    </div>
  );
}
