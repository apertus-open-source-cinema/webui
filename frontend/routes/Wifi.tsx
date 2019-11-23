import * as React from 'react';
import { exec_table, exec } from '../util/exec';
import { useEffect, useState } from 'react';

export const text = 'Wifi Configuration';
export const route = '/wifi';

export class Component extends React.Component<{}, any> {
  constructor(props) {
    super(props);

    this.state = {
      wifi_networks: [],
      last_refresh: '',
    };
    setInterval(() => {
      exec_table('nmcli dev wifi').then(result => this.setState({ wifi_networks: result }));
      exec('date').then(result => this.setState({ last_refresh: result }));
    }, 1000);
  }

  render() {
    return (
      <div>
        <Table data={this.state.wifi_networks} />
      </div>
    );
  }
}

function Table(props) {
  const { data } = props;
  if (data.length === 0) return <table />;
  return (
    <table>
      <thead>
        <tr>
          {Object.keys(data[0]).map(s => (
            <th key={s}>{s}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row: any, i) => (
          <tr key={i}>
            {Object.values(row).map((s: any, i: number) => (
              <td key={i}>{s}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
