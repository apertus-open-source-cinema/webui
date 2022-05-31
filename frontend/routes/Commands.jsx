// SPDX-FileCopyrightText: © 2022 Andrej Balyschew <ab@apertus.org>
// SPDX-License-Identifier: AGPL-3.0-only

import * as React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Container,
  makeStyles,
  Typography,
} from '@material-ui/core';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import { NCTRL_BASE_PATH } from '../util/nctrl.js';
import { exec } from '../util/exec.js';

export const title = 'Commands';
export const route = '/commands';
export const position = 2;

const useStyles = makeStyles(theme => ({
  button: {
    flexGrow: 1,
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    padding: theme.spacing(12, 0, 6),
  },
  text: {
    textAlign: 'center',
  },
  container: {
    padding: '0.5rem',
    display: 'flex',
    justifyContent: 'center',
  },
}));

export function Component() {
  const classes = useStyles();

  const serviceStatusScript = NctrlValue.of(NCTRL_BASE_PATH + 'scripts/check_axiom_service_status');
  const [serviceStatus, setServiceStatus] = React.useState(false);
  React.useEffect(() => {
    const interval = setInterval(
      () => serviceStatusScript.value().then(x => setServiceStatus(x === 'true')),
      1000
    );
    return () => {
      clearInterval(interval);
    };
  });

  const rebootScript = NctrlValue.of(NCTRL_BASE_PATH + 'scripts/reboot');
  const poweroffScript = NctrlValue.of(NCTRL_BASE_PATH + 'scripts/power_off');

  const startHDMIScript = NctrlValue.of(NCTRL_BASE_PATH + 'scripts/start_hdmi');
  const stopHDMIScript = NctrlValue.of(NCTRL_BASE_PATH + 'scripts/stop_hdmi');

  const startAXIOMScript = NctrlValue.of(NCTRL_BASE_PATH + 'scripts/start_axiom');
  const stopAXIOMScript = NctrlValue.of(NCTRL_BASE_PATH + 'scripts/stop_axiom');

  const [isRebootConfirmation, showRebootConfirmation] = React.useState(false);
  const handleRebootConfirmation = () => {
    showRebootConfirmation(true);
  };

  const [isPowerOffConfirmation, showPowerOffConfirmation] = React.useState(false);
  const handlePowerOffConfirmation = () => {
    showPowerOffConfirmation(true);
  };

  return (
    <div>
      <div className={classes.heroContent}>
        <Container maxWidth="xs" className={classes.container}>
          <Typography>Service: {serviceStatus === true ? 'ACTIVE' : 'INACTIVE'}</Typography>
        </Container>
        <Container maxWidth="xs" className={classes.container}>
          <ButtonGroup size="large">
            <Button
              className={classes.button}
              disabled={serviceStatus}
              onClick={() => exec('axiom_start.sh').catch(err => console.log(err))}
            >
              Start AXIOM
            </Button>
            <Button
              className={classes.button}
              disabled={!serviceStatus}
              onClick={() => exec('axiom_stopsh').catch(err => console.log(err))}
            >
              Stop AXIOM
            </Button>
          </ButtonGroup>
        </Container>
        <Container maxWidth="xs" className={classes.container}>
          <ButtonGroup size="large">
            <Button
              className={classes.button}
              disabled={!serviceStatus}
              onClick={() => exec('axiom_sequencer_start.sh').catch(err => console.log(err))}
            >
              Start HDMI
            </Button>
            <Button
              className={classes.button}
              disabled={!serviceStatus}
              onClick={() => exec('axiom_sequencer_stop.sh').catch(err => console.log(err))}
            >
              Stop HDMI
            </Button>
          </ButtonGroup>
        </Container>
        <Container maxWidth="xs" className={classes.container}>
          <ButtonGroup size="large">
            <Button className={classes.button} onClick={() => handleRebootConfirmation()}>
              Reboot
            </Button>
            <Button className={classes.button} onClick={() => handlePowerOffConfirmation()}>
              Power off
            </Button>
            <ConfirmDialog
              open={isRebootConfirmation}
              setOpen={showRebootConfirmation}
              message="reboot"
              onConfirm={() => exec('reboot now').catch(err => console.log(err))}
            ></ConfirmDialog>
            <ConfirmDialog
              open={isPowerOffConfirmation}
              setOpen={showPowerOffConfirmation}
              message="power off"
              onConfirm={() => exec('shutdown --poweroff').catch(err => console.log(err))}
            ></ConfirmDialog>
          </ButtonGroup>
        </Container>
      </div>
    </div>
  );
}

function ConfirmDialog(props) {
  const { title, message, open, setOpen, onConfirm } = props;

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogContent>
        <Typography>Please confirm {message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            onConfirm();
            setOpen(false);
          }}
        >
          Confirm
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
          }}
          color="default"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
