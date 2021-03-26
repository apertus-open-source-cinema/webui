import * as React from 'react';
import { useState } from 'react';

import CameraIcon from '@material-ui/icons/Camera';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';

import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';

import { Command } from '../components/CommandWidgets';
import CameraLoadWidget from '../components/CameraLoadWidget.jsx';

export const title = 'System Information';
export const route = '/system_information';
export const explanation = `Get an overview of whats going on in the linux side of your camera. 
  Ip address, system load, etc can be found here`;

export function Component(props) {
  const [modalOpen, setmodalOpen] = useState(false);

  return (
    <div>
      <Modal
        open={modalOpen}
        onClose={() => {
          setmodalOpen(false);
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            overflow: 'scroll',
            width: 600,
            backgroundColor: 'white',
            border: '1px solid black',
            padding: '20px',
          }}
        >
          <Typography variant="h5" align="center">
            Camera Load Graph
            <Button
              style={{ float: 'right' }}
              onClick={() => {
                setmodalOpen(false);
              }}
            >
              <CancelPresentationIcon />
            </Button>
          </Typography>
          <CameraLoadWidget />
        </div>
      </Modal>
      <Button
        variant="contained"
        color="primary"
        endIcon={<CameraIcon />}
        onClick={() => {
          setmodalOpen(true);
        }}
        style={{ float: 'right', margin: '15px' }}
      >
        Camera Load
      </Button>
      <br />
      <br />
      <Command command="date" interval={1000} />
      <Command command="uptime" interval={1000} />
      <Command command="free -h" interval={1000} />
      <Command command="ip a" interval={1000} />
      <Command command="uname -a" interval={10000} />
      <Command command="ps -aef --forest" interval={10000} />
    </div>
  );
}
