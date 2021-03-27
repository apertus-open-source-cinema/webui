import React from 'react';
import WifiIcon from '../components/WifiIcon';
import WifiPopUp from '../components/WifiPopUp';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import InfoIcon from '@material-ui/icons/Info';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
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
  container: {
    width: '130px',
    display: 'flex',
    justifyContent: 'flex-end',
    marginLeft: '1em',
  },
  icon: {
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8,
    },
  },
  chip: {
    height: '30px',
    paddingTop: '2px',
  },
}));

export const WifiDetails = ({ wifiNetwork }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleDialog = () => {
    setOpen(true);
  };

  return (
    <>
      <div className={`${classes.row} ${classes.wrapper}`}>
        <div className={classes.row}>
          <WifiIcon SIGNAL={parseInt(wifiNetwork.SIGNAL, 10)} />
          <Typography className={wifiNetwork['IN-USE'] === '*' ? classes.active : ''}>
            {wifiNetwork.SSID}
          </Typography>
        </div>
        <div className={classes.row}>
          <div className={classes.details}>
            <Typography>{wifiNetwork.BSSID}</Typography>
            <div className={classes.container}>
              <Typography component="div">
                <div className={classes.row}>
                  {wifiNetwork.SECURITY.split(' ').map((security) => (
                    <Chip className={classes.chip} label={security} color="primary" />
                  ))}
                </div>
              </Typography>
            </div>
          </div>
          <InfoIcon className={classes.icon} color="primary" onClick={handleDialog} />
          <WifiPopUp wifiNetwork={wifiNetwork} open={open} setOpen={setOpen} />
        </div>
      </div>
      <Divider />
    </>
  );
};
