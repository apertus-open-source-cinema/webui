import React, { useEffect, useState } from 'react';
import { WifiDetails } from '../components/WifiDetails';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';

import { exec_table, exec } from '../util/exec';

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
  const [wifiNetworks, setWifiNetworks] = useState();
  const [lastRefresh, setLastRefresh] = useState();
  const [sortBy, setSortBy] = useState('Default');

  const sortArrayOfObjects = (wifiNetworks, key) => {
    if (key === 'Default') {
      return wifiNetworks;
    }
    wifiNetworks.sort((a, b) => {
      return a[key].localeCompare(b[key], undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    });

    return wifiNetworks;
  };

  useEffect(() => {
    setInterval(() => {
      exec_table('nmcli dev wifi').then(result => setWifiNetworks(result));
      exec('date').then(result => setLastRefresh(result));
    }, 1000);
  }, []);

  const handleChange = event => {
    setSortBy(event.target.value);
  };

  return (
    <div className={classes.wifiNetwork}>
      <div className={classes.header}>
        <div>
          <Typography color="primary">Last Refresh</Typography>{' '}
          <Typography>{lastRefresh}</Typography>
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
      {wifiNetworks ? (
        sortArrayOfObjects(wifiNetworks, sortBy).map((wifiNetwork, i) => (
          <WifiDetails wifiNetwork={wifiNetwork} key={i} />
        ))
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
