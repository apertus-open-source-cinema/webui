import React from 'react';

import SignalWifi0BarIcon from '@material-ui/icons/SignalWifi0Bar';
import SignalWifi1BarIcon from '@material-ui/icons/SignalWifi1Bar';
import SignalWifi2BarIcon from '@material-ui/icons/SignalWifi2Bar';
import SignalWifi3BarIcon from '@material-ui/icons/SignalWifi3Bar';
import SignalWifi4BarIcon from '@material-ui/icons/SignalWifi4Bar';

const WifiIcon = ({ SIGNAL }) => {
  const returnWifiIcon = () => {
    if (0 <= SIGNAL && SIGNAL < 20) {
      return <SignalWifi0BarIcon color="primary" />;
    } else if (20 <= SIGNAL && SIGNAL < 40) {
      return <SignalWifi1BarIcon color="primary" />;
    } else if (40 <= SIGNAL && SIGNAL < 60) {
      return <SignalWifi2BarIcon color="primary" />;
    } else if (60 <= SIGNAL && SIGNAL < 80) {
      return <SignalWifi3BarIcon color="primary" />;
    } else {
      return <SignalWifi4BarIcon color="primary" />;
    }
  };

  return returnWifiIcon();
};

export default WifiIcon;
