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
  MenuItem,
  TextField,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useState } from 'react';
import { NonValueListEntry, ValueListEntry } from './Registers';

export const title = 'Dashboard';
export const route = '/dashboard';
export const explanation = `**[WIP] - not ready to be used**
    
  The dashboard allows you to control parameters of the camera in a convenient and 
  **set-compatible** way. Here you can set the ISO, exposure time and related parameters.`;

const useStyles = makeStyles(theme => ({
  add: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    margin: '50px',
  },
}));

export function Component(props) {
  const classes = useStyles();

  const [widgets, setWidgets] = useState([]);

  return <div>{<AddComponents />}</div>;
}

const input_methods = {
  textfield: {
    component({ path }) {
      return <ValueListEntry entry={{ path, type: 'f', name: path.match(/\/([^\/]*)?$/)[1] }} />;
    },
  },
  slider: {
    params: {
      min: 'float',
      max: 'float',
      integer: 'bool',
    },
    component({ path }) {},
  },
};

function AddComponents({ callback }) {
  const classes = useStyles();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInputMethod, setSelectedInputMethod] = useState(false);

  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Widget</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a new widget to the dashboard, select an Input Method and a path.
            <br />
            The Path can be found out using the Register Explorer.
          </DialogContentText>
          <TextField autoFocus margin="dense" label="Path" fullWidth />
          <TextField margin="dense" label="Input Type" select fullWidth>
            {Object.keys(input_methods).map(name => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => setDialogOpen(false)} color="primary">
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
        <AddIcon />
      </Fab>
    </>
  );
}
