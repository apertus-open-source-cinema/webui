import * as React from 'react';
import {
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
import { NctrlValue } from '../util/nctrlValue';
import { Fs } from '../util/fs';
import { usePromiseGenerator } from '../util/usePromiseGenerator';
import { NCTRL_BASE_PATH } from '../util/nctrl';
import { NctrlValueTextfield } from '../components/NctrlValueEdit';

export const title = 'Dashboard';
export const route = '/dashboard';
export const explanation = `**[WIP] - not ready to be used**
    
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
  },
  notWide: {
    maxWidth: 600,
    padding: 3,
    margin: '10px auto',
  },
}));

export function Component(props) {
  const classes = useStyles();

  const [yaml, setYaml] = useState(null);
  const file_yml = usePromiseGenerator(() => Fs.of(YAML_PATH).load(), YAML_PATH);
  useEffect(() => {
    if (yaml === null && file_yml !== undefined) {
      console.log(file_yml);
      setYaml(file_yml);
    }
  }, [file_yml]);

  const parsed = useYaml(yaml) || [];
  console.log(parsed);

  return (
    <div>
      {
        <AddComponents
          current_yml={yaml}
          setYaml={yaml => {
            setYaml(yaml);
            saveYaml(yaml);
          }}
        />
      }
      <ul className={classes.ul}>
        {parsed.map((x, i) => {
          const InputComponent = input_methods[x.input];
          return <InputComponent {...x} key={i} />;
        })}
      </ul>
    </div>
  );
}

const input_methods = {
  textfield({ path }) {
    const classes = useStyles();
    const nctrlValue = NctrlValue.of(`${NCTRL_BASE_PATH}/${path}`);

    return (
      <Paper className={classes.notWide}>
        <NctrlValueTextfield
          nctrlValue={nctrlValue}
        />
      </Paper>
    );
  },
  slider({ path }) {
    new NctrlValue(path);
  },
};

function AddComponents({ current_yml: currentYaml, setYaml }) {
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
          ></TextField>
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
            Add
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
