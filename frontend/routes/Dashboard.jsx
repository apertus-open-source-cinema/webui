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

export const title = 'Dashboard';
export const route = '/dashboard';
export const explanation = `
  The dashboard allows you to control parameters of the camera in a convenient and 
  **set-compatible** way. Here you can set the ISO, exposure time and related parameters.`;

const YAML_PATH = 'dashboard.yml';

const useStyles = makeStyles(theme => ({
  add: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    margin: '50px',
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

  const parsed = useYaml(yaml) || [];

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

function useYaml(yamlString) {
  const [deserialized, setDeserialized] = useState(null);
  useEffect(() => {
    setDeserialized(safeLoad(yamlString));
  }, [yamlString]);
  return deserialized;
}

function saveYaml(yamlString) {
  Fs.of(YAML_PATH).upload(yamlString);
}
