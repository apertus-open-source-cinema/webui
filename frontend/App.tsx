import * as React from "react";
// @ts-ignore
import routes from "./routes/*.tsx"
import {Drawer, ListItemIcon, ListItemText, ListItem} from '@material-ui/core';
import List from "@material-ui/core/List";
import {Link as RouterLink, BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";

export class App extends React.Component<any, any> {
    render() {
        function ListItemLink(props) {
            const {icon, primary, to} = props;

            const renderLink: any = React.useMemo(
                () =>
                    React.forwardRef((itemProps, ref: any) => (
                        <RouterLink to={to} {...itemProps} innerRef={ref}/>
                    )),
                [to],
            );

            return (
                <li>
                    <ListItem button component={renderLink}>
                        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                        <ListItemText primary={primary}/>
                    </ListItem>
                </li>
            );
        }

        return (
            <Router>

                <AppBar position="fixed">
                    <Toolbar>
                        <Typography variant="h6" noWrap>
                            AXIOM -
                            <Switch>
                                {Object.values(routes).map(({route, text}: any) =>
                                    <Route exact path={route} key={route}>{text}</Route>)
                                }
                            </Switch>
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Drawer variant="permanent">
                    <List>
                        {Object.values(routes).map(({route, text}: any) => (
                            <ListItemLink to={route} primary={text} key={route}/>
                        ))}
                    </List>
                </Drawer>

                <div>
                    <Switch>
                        {Object.values(routes).map(({route, Component}: any) => <Route exact path={route} key={route}
                                                                                  component={Component}/>)}
                    </Switch>
                </div>

            </Router>);
    }
}
