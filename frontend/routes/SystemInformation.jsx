// SPDX-FileCopyrightText: © 2019 Jaro Habiger <jarohabiger@googlemail.com>
// SPDX-License-Identifier: AGPL-3.0-only

import * as React from 'react';
import { Command } from '../components/CommandWidgets';

export const title = 'System Information';
export const route = '/system_information';
export const explanation = `Get an overview of whats going on in the linux side of your camera. 
  Ip address, system load, etc can be found here`;

export function Component(props) {
  return (
    <div>
      <Command command="date" interval={1000} />
      <Command command="uptime" interval={1000} />
      <Command command="free -h" interval={1000} />
      <Command command="ip a" interval={1000} />
      <Command command="uname -a" interval={10000} />
      <Command command="ps -aef --forest" interval={10000} />
    </div>
  );
}
