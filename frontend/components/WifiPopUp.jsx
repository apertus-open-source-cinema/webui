import React from 'react';
import CircularProgressWithLabel from '../components/CircularProgressWithLabel';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import NetworkCheckIcon from '@material-ui/icons/NetworkCheck';
import SpeedIcon from '@material-ui/icons/Speed';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import CloseIcon from '@material-ui/icons/Close';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    background: 'transparent',
  },
  dialogTitle: {
    padding: '0.6em',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '75%',
    background: '#FA8756',
    color: '#fff',
    margin: '0 auto',
    borderRadius: '6px',
    marginTop: '30px',
    marginBottom: '-30px',
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
    fontSize: '12px',
  },
  wrapper: {
    width: '100%',
  },
  details: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
  },
  icon: {
    height: '25px',
  },
  value: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: '#898989',
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '8px',
  },
});

export default function WifiPopUp({ open, setOpen, wifiNetwork }) {
  const { BSSID, SSID, MODE, CHAN, RATE, SIGNAL, SECURITY } = wifiNetwork;
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
          <Typography>{SSID}</Typography>
          <CircularProgressWithLabel value={parseInt(SIGNAL, 10)} />
        </div>

        <div className={classes.dialogBody}>
          <div className={classes.wrapper}>
            <Typography component="div" className={classes.details} color="primary">
              <div className={classes.bodyTitle}>BSSID</div>
              <div className={classes.value}>{BSSID}</div>
            </Typography>
            <Typography component="div" className={classes.details} color="primary">
              <div className={classes.bodyTitle}>MODE</div>
              <div className={classes.value}>{MODE}</div>
            </Typography>
            <Typography component="div" className={classes.details} color="primary">
              <div className={classes.bodyTitle}>CHAN</div>
              <div className={classes.value}>
                <div className={classes.icon}>
                  <NetworkCheckIcon fontSize="small" />
                </div>
                {CHAN}
              </div>
            </Typography>
            <Typography component="div" className={classes.details} color="primary">
              <div className={classes.bodyTitle}>RATE</div>
              <div className={classes.value}>
                <div className={classes.icon}>
                  <SpeedIcon fontSize="small" />
                </div>
                {RATE}
              </div>
            </Typography>
            <Typography component="div" className={classes.details} color="primary">
              <div className={classes.bodyTitle}>SECURITY</div>
              <div className={classes.value}>
                <div className={classes.icon}>
                  <VpnKeyIcon fontSize="small" />
                </div>
                {SECURITY}
              </div>
            </Typography>
          </div>
        </div>
        <div className={classes.buttonWrapper}>
          <Button onClick={handleClose} color="secondary" startIcon={<CloseIcon />}>
            Close
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
