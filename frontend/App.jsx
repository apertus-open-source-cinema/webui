import * as React from 'react';
import routes from './routes/*.jsx';
import {
  Drawer,
  ListItemIcon,
  ListItemText,
  ListItem,
  makeStyles,
  IconButton,
} from '@material-ui/core';
import List from '@material-ui/core/List';
import Modal from '@material-ui/core/Modal';
import { Link as RouterLink, Switch, Route } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import { useState } from 'react';
import clsx from 'clsx';
import { isDesktop } from './util/isDesktop';
import CameraLoadWidget from './components/CameraLoadWidget.jsx';

import Icon from '@material-ui/core/Icon';
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.background.default,
    width: '100vw',
    minHeight: '100vh',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    '& ul': {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: isDesktop ? -drawerWidth : 0,
    maxWidth: isDesktop ? `calc(100% - ${drawerWidth}px)` : '100%',
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  toolbar: theme.mixins.toolbar,
}));

export function App(props) {
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = useState(isDesktop);
  const [modalOpen, setmodalOpen] = useState(false);

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap>
            {process.env.MOCK ? 'Mock' : ''} AXIOM WebUi -&nbsp;
            <Switch>
              {Object.values(routes).map(({ route, title }) => (
                <Route exact path={route} key={route}>
                  {title}
                </Route>
              ))}
            </Switch>
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        className={classes.drawer}
        variant={isDesktop ? 'persistent' : 'temporary'}
        classes={{
          paper: classes.drawerPaper,
        }}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <div className={classes.toolbar} />
        <List>
          {Object.values(routes).map(({ route, title, position }) => (
            <ListItemLink
              to={route}
              primary={title}
              key={route}
              position={position || 100}
              onClick={!isDesktop ? () => setDrawerOpen(false) : () => {}}
            />
          ))}
        </List>
        <Button
          variant="contained"
          color="primary"
          endIcon={<Icon>send</Icon>}
          onClick={() => {
            setmodalOpen(true);
          }}
          style={{ margin: '10px' }}
        >
          Camera Load
        </Button>
      </Drawer>

      <div
        className={clsx(classes.content, {
          [classes.contentShift]: drawerOpen && isDesktop,
        })}
      >
        <div className={classes.toolbar} />
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
              width: 400,
              backgroundColor: 'white',
              border: '1px solid black',
              padding: '20px',
            }}
          >
            <Typography variant="h5" align="center">
               Current Camera Load
          <Button style={{ float: "right" }} onClick={()=>{setmodalOpen(false)}}>
            <CancelPresentationIcon />
          </Button>
        </Typography>
            <CameraLoadWidget />
          </div>
        </Modal>

        <Switch>
          {Object.values(routes).map(({ route, Component }) => (
            <Route exact path={route} key={route} component={Component} />
          ))}
        </Switch>
      </div>
    </div>
  );
}

function ListItemLink({ icon, primary, to, position, onClick }) {
  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => <RouterLink to={to} {...itemProps} innerRef={ref} />),
    [to]
  );

  return (
    <li style={{ order: position }}>
      <ListItem button component={renderLink} onClick={onClick}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}
