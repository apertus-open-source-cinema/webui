import React, { useState } from 'react';

import { WifiDetails } from '../components/WifiDetails';
import { makeStyles } from '@material-ui/core/styles';
// import { exec_table, exec } from '../util/exec';

export const title = 'Wifi Configuration';
export const route = '/wifi';

const useStyles = makeStyles({
  wifiNetwork: {
    margin: '2em',
    width: '80%',
    margin: '0 auto',
  },
});

// export default class Component extends React.Component {
export function Component(props) {
  const classes = useStyles();
  const [wifi_networks, setWifi_networks] = useState([
    {
      'IN-USE': '',
      BSSID: '80:26:89:02:64:12',
      SSID: 'GigaFibre_DedSec',
      MODE: 'Infra',
      CHAN: '1',
      RATE: '270 Mbit/s',
      SIGNAL: '82',
      BARS: '▂▄▆█',
      SECURITY: 'WPA2',
      '': '',
    },
    {
      'IN-USE': '',
      BSSID: '80:26:89:02:64:12',
      SSID: 'GigaFibre_DedSec',
      MODE: 'Infra',
      CHAN: '1',
      RATE: '270 Mbit/s',
      SIGNAL: '82',
      BARS: '▂▄▆█',
      SECURITY: 'WPA2',
      '': '',
    },
    {
      'IN-USE': '',
      BSSID: '80:26:89:02:64:12',
      SSID: 'GigaFibre_DedSec',
      MODE: 'Infra',
      CHAN: '1',
      RATE: '270 Mbit/s',
      SIGNAL: '82',
      BARS: '▂▄▆█',
      SECURITY: 'WPA2',
      '': '',
    },
  ]);

  // setInterval(() => {
  //   exec_table('nmcli dev wifi').then(result => this.setState({ wifi_networks: result }));
  //   exec('date').then(result => this.setState({ last_refresh: result }));
  // }, 1000);

  return (
    <div className={classes.wifiNetwork}>
      {wifi_networks.map(wifi_network => (
        <WifiDetails wifi_network={wifi_network} />
      ))}
    </div>
  );
}
