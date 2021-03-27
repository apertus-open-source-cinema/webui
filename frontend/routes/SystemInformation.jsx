import * as React from 'react';
import LoadGraphV2 from '../components/LoadGraphV2';
import RunCommand from '../components/RunCommand';

export const title = 'System Information';
export const route = '/system_information';
export const explanation = `Get an overview of whats going on in the linux side of your camera. 
  Ip address, system load, etc can be found here`;

export function Component() {
  return (
    <div>
      <LoadGraphV2 />
      <RunCommand command="uptime" interval={1000} />
      <RunCommand command="date" interval={1000} />
      <RunCommand command="free -h" interval={1000} />
      <RunCommand command="ip a" interval={1000} />
      <RunCommand command="uname -a" interval={10000} />
      <RunCommand command="ps -aef --forest" interval={10000} />
    </div>
  );
}
