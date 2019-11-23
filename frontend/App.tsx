import * as React from 'react';
// @ts-ignore
import routes from './routes/*.tsx';
import { Drawer, ListItemIcon, ListItemText, ListItem, makeStyles } from '@material-ui/core';
import List from '@material-ui/core/List';
import { Link as RouterLink, BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
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
  },
  content: {
    flexGrow: 1,
    maxWidth: `calc(100vw - ${drawerWidth}px)`,
  },
  toolbar: theme.mixins.toolbar,
}));

function ListItemLink(props) {
  const { icon, primary, to } = props;

  const renderLink: any = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref: any) => (
        <RouterLink to={to} {...itemProps} innerRef={ref} />
      )),
    [to]
  );

  return (
    <li>
      <ListItem button component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

export function App(props: any) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            AXIOM WebUi -&nbsp;
            <Switch>
              {Object.values(routes).map(({ route, text }: any) => (
                <Route exact path={route} key={route}>
                  {text}
                </Route>
              ))}
            </Switch>
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <List>
          {Object.values(routes).map(({ route, text }: any) => (
            <ListItemLink to={route} primary={text} key={route} />
          ))}
        </List>
      </Drawer>

      <div className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          {Object.values(routes).map(({ route, Component }: any) => (
            <Route exact path={route} key={route} component={Component} />
          ))}
        </Switch>
      </div>
    </div>
  );
}
