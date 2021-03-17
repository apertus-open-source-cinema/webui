import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import CircularProgressWithLabel from '../components/CircularProgressWithLabel';
import SignalWifi0BarIcon from '@material-ui/icons/SignalWifi0Bar';
import SignalWifi1BarIcon from '@material-ui/icons/SignalWifi1Bar';
import SignalWifi2BarIcon from '@material-ui/icons/SignalWifi2Bar';
import SignalWifi3BarIcon from '@material-ui/icons/SignalWifi3Bar';
import SignalWifi4BarIcon from '@material-ui/icons/SignalWifi4Bar';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    background: 'transparent',
  },

  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '1em',
  },
  dialogTitle: {
    padding: '1em',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '70%',
    background: '#FA8756',
    color: '#fff',
    margin: '0 auto',
    borderRadius: '6px',
    marginTop: '30px',
    marginBottom: '-40px',
    zIndex: '1',
    maxWidth: '380px',
  },
  dialogBody: {
    width: '75%',
    margin: '0 auto',
    padding: '4em 2em 2em',
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    borderRadius: '8px',
    zIndex: '0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '400px',
    background: '#fff',
  },
  bodyTitle: {
    fontSize: '14px',
    marginRight: '24px',
  },
  value: {
    color: '#898989',
  },
}));

export default function WifiPopUp({ open, setOpen, wifi_network }) {
  const { IN_USE, BSSID, SSID, MODE, CHAN, RATE, SIGNAL, BARS, SECURITY } = wifi_network;
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
        fullWidth={true}
        maxWidth={'sm'}
      >
        <div className={classes.dialogTitle}>
          <span className={classes.title}>
            <SignalWifi4BarIcon /> {SSID}
          </span>
          <CircularProgressWithLabel value={40} />
        </div>

        <div className={classes.dialogBody}>
          <div>
            <Typography color="primary">
              <span className={classes.bodyTitle}>BSSID</span>
              <span className={classes.value}>{BSSID}</span>
            </Typography>
            <Typography color="primary">
              <span className={classes.bodyTitle}>MODE</span>
              <span className={classes.value}>{MODE}</span>
            </Typography>
            <Typography color="primary">
              <span className={classes.bodyTitle}>CHAN</span>
              <span className={classes.value}>{CHAN}</span>
            </Typography>
            <Typography color="primary">
              <span className={classes.bodyTitle}>RATE</span>
              <span className={classes.value}>{RATE}</span>
            </Typography>
            <Typography color="primary">
              <span className={classes.bodyTitle}>SECURITY</span>
              <span className={classes.value}>{SECURITY}</span>
            </Typography>
          </div>
        </div>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </Dialog>
    </div>
  );
}
