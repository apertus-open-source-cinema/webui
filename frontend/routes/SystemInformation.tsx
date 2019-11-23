import * as React from 'react';
import { PlainCommand } from '../components/execComponents';

export const text = 'System Information';
export const route = '/system_information';
export function Component(props) {
  return (
    <div>
      <PlainCommand command="date" interval={1000} />
      <PlainCommand command="uptime" interval={1000} />
      <PlainCommand command="free -h" interval={1000} />
      <PlainCommand command="ip a" interval={1000} />
      <PlainCommand command="uname -a" interval={10000} />
      <PlainCommand command="ps -aef --forest" interval={10000} />
    </div>
  );
}
