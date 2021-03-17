import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { WifiDetails } from '../components/WifiDetails';

import { makeStyles } from '@material-ui/core/styles';

import { exec_table, exec } from '../util/exec';
import { sortArrayOfObjects } from '../util/sort';

export const title = 'Wifi Configuration';
export const route = '/wifi';

const useStyles = makeStyles({
  wifiNetwork: {
    margin: '2em',
    marginTop: '30px',
    width: '80%',
    margin: '0 auto',
  },
  select: {
    width: '220px',
  },
});

export function Component(props) {
  const classes = useStyles();
  const [wifi_networks, setWifi_networks] = useState([
    {
      'IN-USE': '',
      BSSID: '26:89:02:64:12',
      SSID: 'DedSec',
      MODE: 'nfra',
      CHAN: '6',
      RATE: '70 Mbit/s',
      SIGNAL: '2',
      BARS: '▂▄▆█',
      SECURITY: 'WA2',
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
      BSSID: '2:64:12',
      SSID: 'Wi',
      MODE: 'a',
      CHAN: '04',
      RATE: '20 Mbit/s',
      SIGNAL: '8',
      BARS: '▂▄▆█',
      SECURITY: 'A2',
      '': '',
    },
  ]);
  const [sortBy, setSortBy] = useState('SSID');

  // setInterval(() => {
  //   exec_table('nmcli dev wifi').then(result => this.setState({ wifi_networks: result }));
  //   exec('date').then(result => this.setState({ last_refresh: result }));
  // }, 1000);
  const handleChange = event => {
    setSortBy(event.target.value);
    setWifi_networks(sortArrayOfObjects(wifi_networks, event.target.value));
  };

  return (
    <div className={classes.wifiNetwork}>
      <TextField
        select
        className={classes.select}
        label="Sort By"
        value={sortBy}
        onChange={handleChange}
        variant="outlined"
      >
        <MenuItem value="BSSID">BSSID</MenuItem>
        <MenuItem value="SSID">SSID</MenuItem>
        <MenuItem value="MODE">MODE</MenuItem>
        <MenuItem value="CHAN">CHAN</MenuItem>
        <MenuItem value="RATE">RATE</MenuItem>
        <MenuItem value="SIGNAL">SIGNAL</MenuItem>
        <MenuItem value="SECURITY">SECURITY</MenuItem>
      </TextField>
      {wifi_networks
        ? wifi_networks.map(wifi_network => <WifiDetails wifi_network={wifi_network} />)
        : null}
    </div>
  );
}
