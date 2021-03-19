import React from 'react';
import WifiIcon from '../components/WifiIcon';
import WifiPopUp from '../components/WifiPopUp';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import InfoIcon from '@material-ui/icons/Info';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1em',
  },
  active: {
    color: '#FA8756',
    fontWeight: '700',
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
  icon: {
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8,
    },
  },
  chip: {
    height: '24px',
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
          <WifiIcon SIGNAL={parseInt(wifi_network.SIGNAL, 10)} />
          {/* <SignalWifi4BarIcon color="primary" /> */}
          <Typography className={wifi_network['IN-USE'] === '*' ? classes.active : ''}>
            {wifi_network.SSID}
          </Typography>
        </div>
        <div className={classes.row}>
          <div className={classes.details}>
            <Typography>{wifi_network.BSSID}</Typography>
            <Typography component="div">
              <Chip
                className={classes.chip}
                variant="outlined"
                label={wifi_network.SECURITY}
                color="primary"
              />
            </Typography>
          </div>
          <InfoIcon className={classes.icon} color="primary" onClick={handleDialog} />
          <WifiPopUp wifi_network={wifi_network} open={open} setOpen={setOpen} />
        </div>
      </div>
      <Divider />
    </>
  );
};
