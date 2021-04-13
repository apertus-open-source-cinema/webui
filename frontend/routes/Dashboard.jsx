import * as React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Grid,
  Link,
  makeStyles,
  Paper,
  TextField,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { useEffect, useRef, useState } from 'react';
import { safeLoad } from 'js-yaml';
import { Fs } from '../util/fs';
import { usePromiseGenerator } from '../util/usePromiseGenerator';
import { NctrlValueWidgets } from '../components/*.jsx';
import Typography from '@material-ui/core/Typography';
import { NCTRL_BASE_PATH } from '../util/nctrl';
import { Player } from '@lottiefiles/react-lottie-player';
import ErrorTwoToneIcon from '@material-ui/icons/ErrorTwoTone';

// This animation is taken from : https://lottiefiles.com/624-camera-aperture and comes under creative commons license 4.0
const apertus_animation = require('../util/animations/aperture.json');

export const title = 'Dashboard';
export const route = '/dashboard';
export const explanation = `
  The dashboard allows you to control parameters of the camera in a convenient and 
  **set-compatible** way. Here you can set the ISO, exposure time and related parameters.`;

const YAML_PATH = 'dashboard.yml';
const validYAML = new Set([
  '- widget: spacing',
  '- widget: slider',
  '- widget: textfield',
  '- widget: buttons',
]);

const useStyles = makeStyles(theme => ({
  add: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    margin: '50px',
  },
  error_message: {
    padding: theme.spacing(2),
  },
  error_wrapper: {
    textAlign: 'left',
    width: '100%',
  },
  error_player: {
    height: '10px',
    width: '10px',
    alignItems: 'center',
    display: 'flex',
  },
  load_player: {
    height: '10px',
    width: '10px',
    alignItems: 'center',
    display: 'flex',
  },
  ul: {
    listStyle: 'none',
    padding: 0,
    paddingBottom: 100,
  },
  notWide: {
    maxWidth: 750,
    padding: 3,
    margin: '10px auto',
    marginBottom: '20px',
  },
  paper: {
    padding: '10px 5px',
  },
  attribution: {
    fontFamily: theme.typography.fontFamily,
    padding: theme.spacing(1),
  },
}));

export function Component(props) {
  const classes = useStyles();

  const [yaml, setYaml] = useState(null);
  const file_yml = usePromiseGenerator(() => Fs.of(YAML_PATH).load(), YAML_PATH);
  useEffect(() => {
    if (yaml === null && file_yml !== undefined) {
      setYaml(file_yml);
    }
  }, [file_yml]);

  const parsed = useYaml(yaml);
  const [rerenderDep, setRerenderDep] = useState(0);
  const rerender = () => setRerenderDep(rerenderDep + 1);

  return (
    <Box>
      {
        <EditDashboard
          current_yml={yaml}
          setYaml={yaml => {
            setYaml(yaml);
            saveYaml(yaml);
          }}
        />
      }
      <div>
        {!parsed ? (
          <Player
            src={apertus_animation}
            autoplay={true}
            loop={true}
            controls={false}
            style={{ height: '500px', width: '500px' }}
            speed={3}
          />
        ) : parsed.error_message ? (
          <div className={classes.error_wrapper}>
            <Grid item style={{ textAlign: 'center' }}>
              <ErrorTwoToneIcon
                color="error"
                fontSize="large"
                style={{ height: '100px', width: '100px', padding: '0.5rem' }}
              />
            </Grid>

            <Typography color="error" className={classes.error_message}>
              An Error has Occured : <br />
              <br />
              <b>Name</b> : {parsed.error_name} <br />
              <br />
              <b>Message</b> : {parsed.error_message} <br />
              <br />
              <b>Stack</b> : {parsed.error_stack}
            </Typography>
          </div>
        ) : (
          <div>
            <div className={classes.ul}>
              {Object.keys(parsed).map((heading, i) => {
                return (
                  <div className={classes.notWide} key={i}>
                    <Typography variant="h6">{heading}:</Typography>
                    <Paper className={classes.paper}>
                      {parsed[heading].map((x, i) => {
                        const InputWidget =
                          NctrlValueWidgets[
                            `NctrlValue${x.widget.replace(/^(.)/, v => v.toUpperCase())}`
                          ];
                        return (
                          <InputWidget
                            key={i}
                            rerender={rerender}
                            rerenderDep={rerenderDep}
                            {...x}
                            path={`${NCTRL_BASE_PATH}${x.path}`}
                          />
                        );
                      })}
                    </Paper>
                  </div>
                );
              })}
            </div>
            <Link
              target="_blank"
              className={classes.attribution}
              href="https://lottiefiles.com/624-camera-aperture"
            >
              aperture animation
            </Link>
          </div>
        )}
      </div>
    </Box>
  );
}

function EditDashboard({ current_yml: currentYaml, setYaml }) {
  const classes = useStyles();

  const [dialogOpen, setDialogOpen] = useState(false);
  const inputEl = useRef(null);

  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Dashboard</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To edit the dashboard, edit the yml description below. It can also be coppied and shared
            (e.g. in the apertus wiki)
          </DialogContentText>
          <TextField
            multiline
            fullWidth
            variant={'filled'}
            label="YAML dashboard description"
            defaultValue={currentYaml}
            inputRef={inputEl}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setDialogOpen(false);
              setYaml(inputEl.current.value);
            }}
            color="primary"
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
      <Fab
        color="primary"
        className={classes.add}
        aria-label="add"
        onClick={() => setDialogOpen(true)}
      >
        <EditIcon />
      </Fab>
    </>
  );
}

function validateWidgets(yamlString) {
  var idx = 0,
    curWidget = '';
  while (idx < yamlString.length) {
    while (idx < yamlString.length && yamlString[idx] == ' ') idx++;
    if (idx == yamlString.length) return null;
    if (yamlString[idx] == '-' && idx < yamlString.length - 1 && yamlString[idx + 1] == ' ') {
      while (idx < yamlString.length && yamlString[idx] != '\n') curWidget += yamlString[idx++];
      if (!validYAML.has(curWidget)) {
        return curWidget;
      }
      curWidget = '';
    } else {
      while (idx < yamlString.length && yamlString[idx] != '\n') idx++;
    }
    idx++;
  }
  return null;
}

function useYaml(yamlString) {
  const [deserialized, setDeserialized] = useState(null);
  useEffect(() => {
    try {
      const res = validateWidgets(yamlString);
      if (yamlString != null && res)
        throw {
          name: 'Invalid widget',
          message: `Cannot find widget`,
          stack: `Error : ---${res}---; ${yamlString}`,
        };
      setDeserialized(safeLoad(yamlString));
    } catch (error) {
      return setDeserialized({
        error_name: error.name,
        error_message: error.message,
        error_stack: error.stack,
      });
    }
  }, [yamlString]);
  return deserialized;
}

function saveYaml(yamlString) {
  Fs.of(YAML_PATH).upload(yamlString);
}
