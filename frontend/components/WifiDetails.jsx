import React from 'react';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import WifiPopUp from '../components/WifiPopUp';

import SignalWifi0BarIcon from '@material-ui/icons/SignalWifi0Bar';
import SignalWifi1BarIcon from '@material-ui/icons/SignalWifi1Bar';
import SignalWifi2BarIcon from '@material-ui/icons/SignalWifi2Bar';
import SignalWifi3BarIcon from '@material-ui/icons/SignalWifi3Bar';
import SignalWifi4BarIcon from '@material-ui/icons/SignalWifi4Bar';
import InfoIcon from '@material-ui/icons/Info';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1em',
  },
  wrapper: {
    padding: '1.5em 0',
  },
  details: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      gap: '1em',
    },
  },
}));

export const WifiDetails = ({ wifi_network }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleDialog = () => {
    setOpen(true);
  };

  return (
    <>
      <div className={`${classes.row} ${classes.wrapper}`}>
        <div className={classes.row}>
          <SignalWifi4BarIcon color="primary" />
          <Typography>{wifi_network.SSID}</Typography>
        </div>
        <div className={classes.row}>
          <div className={classes.details}>
            <Typography>{wifi_network.BSSID}</Typography>
            <Typography>{wifi_network.SECURITY}</Typography>
          </div>
          <InfoIcon className={classes.icon} color="primary" onClick={handleDialog} />
          <WifiPopUp wifi_network={wifi_network} open={open} setOpen={setOpen} />
        </div>
      </div>
      <Divider />
    </>
  );
};
