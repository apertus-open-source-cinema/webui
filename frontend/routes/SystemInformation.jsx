import * as React from 'react';
import { Command } from '../components/CommandWidgets';
import LoadGraph from '../components/LoadGraph';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export const title = 'System Information';
export const route = '/system_information';
export const explanation = `Get an overview of whats going on in the linux side of your camera. 
  Ip address, system load, etc can be found here`;

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export function Component() {
  const classes = useStyles();

  return (

      <div className={classes.root}>
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Camera load</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <LoadGraph interval={1000} />
        </AccordionDetails>
      </Accordion>
      <Accordion TransitionProps={{ unmountOnExit: true }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>date</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Command command="date" interval={1000} />
        </AccordionDetails>
      </Accordion>
      <Accordion TransitionProps={{ unmountOnExit: true }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>uptime</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Command command="uptime" interval={1000} />
        </AccordionDetails>
      </Accordion>
      <Accordion TransitionProps={{ unmountOnExit: true }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>free -h</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Command command="free -h" interval={1000} />
        </AccordionDetails>
      </Accordion>
      <Accordion TransitionProps={{ unmountOnExit: true }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>ip a</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Command command="ip a" interval={1000} />
        </AccordionDetails>
      </Accordion>
      <Accordion TransitionProps={{ unmountOnExit: true }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>uname -a</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Command command="uname -a" interval={10000} />
        </AccordionDetails>
      </Accordion>
      <Accordion TransitionProps={{ unmountOnExit: true }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>ps -aef --forest</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Command command="ps -aef --forest" interval={10000} />
        </AccordionDetails>
      </Accordion>

    </div>
  );
}
