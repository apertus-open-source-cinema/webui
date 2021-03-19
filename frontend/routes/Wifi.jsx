import React, { useEffect, useState } from 'react';
import { WifiDetails } from '../components/WifiDetails';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';

import { exec_table, exec } from '../util/exec';
import { sortArrayOfObjects } from '../util/sort';

export const title = 'Wifi Configuration';
export const route = '/wifi';

const useStyles = makeStyles(theme => ({
  wifiNetwork: {
    margin: '2em',
    marginTop: '30px',
    width: '80%',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  },
  select: {
    width: '220px',
  },
  skeletonWrapper: {
    margin: '20px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
}));

export function Component(props) {
  const classes = useStyles();
  const [wifi_networks, setWifi_networks] = useState();
  const [last_refresh, setLast_refresh] = useState();
  const [sortBy, setSortBy] = useState('Default');

  useEffect(() => {
    setInterval(() => {
      exec_table('nmcli dev wifi').then(result => setWifi_networks(result));
      exec('date').then(result => setLast_refresh(result));
    }, 1000);
  }, []);

  const handleChange = event => {
    setSortBy(event.target.value);
    setWifi_networks(sortArrayOfObjects(wifi_networks, event.target.value));
  };

  return (
    <div className={classes.wifiNetwork}>
      <div className={classes.header}>
        <div>
          <Typography color="primary">Last Refresh</Typography>{' '}
          <Typography>{last_refresh}</Typography>
        </div>
        <TextField
          select
          className={classes.select}
          label="Sort By"
          value={sortBy}
          onChange={handleChange}
          variant="outlined"
        >
          <MenuItem value="Default">Default</MenuItem>
          <MenuItem value="BSSID">BSSID</MenuItem>
          <MenuItem value="SSID">SSID</MenuItem>
          <MenuItem value="MODE">MODE</MenuItem>
          <MenuItem value="CHAN">CHAN</MenuItem>
          <MenuItem value="RATE">RATE</MenuItem>
          <MenuItem value="SIGNAL">SIGNAL</MenuItem>
          <MenuItem value="SECURITY">SECURITY</MenuItem>
        </TextField>
      </div>
      {wifi_networks ? (
        wifi_networks.map((wifi_network, i) => <WifiDetails wifi_network={wifi_network} key={i} />)
      ) : (
        <div className={classes.skeletonWrapper}>
          <Skeleton height={30} animation="wave" />
          <Skeleton height={30} animation="wave" />
          <Skeleton height={30} animation="wave" />
          <Skeleton height={30} animation="wave" />
          <Skeleton height={30} animation="wave" />
        </div>
      )}
    </div>
  );
}
