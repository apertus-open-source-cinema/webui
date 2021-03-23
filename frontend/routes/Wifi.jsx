import React from 'react';
import { useState } from 'react';
import { exec_table, exec } from '../util/exec';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { green, orange } from '@material-ui/core/colors';
import Skeleton from '@material-ui/lab/Skeleton';
import { Box, Chip } from '@material-ui/core';
import {SignalWifi4Bar, SignalWifi0Bar, SignalWifi1Bar, SignalWifi2Bar, SignalWifi3Bar} from '@material-ui/icons';
export const title = 'Wifi Configuration';
export const route = '/wifi';

export class Component extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      wifi_networks: [],
      last_refresh: '',
    };

    setInterval(() => {
      exec_table('nmcli dev wifi').then(result => {
        if (!result) return;

        this.setState({
          wifi_networks: result,
        });
      });
      exec('date').then(result => {
        this.setState({
          last_refresh: result,
        });
      });
    }, 1000);
  }

  render() {
    return (
      <div>
        <SortableTable rows={this.state.wifi_networks} />
      </div>
    );
  }
}

const in_use = 'IN-USE';
const initial_direction = 'asc';
const security = 'SECURITY';
const bars = 'BARS';
const active_color = orange[50];
const headCells = {
  [in_use]: { numeric: false, disablePadding: true, label: 'Connected' },
  BSSID: { numeric: false, disablePadding: false, label: 'BSSID' },
  SSID: { numeric: false, disablePadding: false, label: 'SSID' },
  MODE: { numeric: false, disablePadding: false, label: 'Mode' },
  CHAN: { numeric: true, disablePadding: false, label: 'Channel' },
  RATE: { numeric: true, disablePadding: false, label: 'Rate' },
  SIGNAL: { numeric: true, disablePadding: false, label: 'Signal' },
  BARS: { numeric: false, disablePadding: false, label: 'Bars' },
  SECURITY: { numeric: false, disablePadding: false, label: 'Security' },
};

function SortableTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  return (
    <TableHead>
      <TableRow>
        {Object.keys(headCells).map(function(key) {
          return (
            <TableCell
              key={key}
              align="center"
              padding={headCells[key].disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === key ? order : false}
            >
              <TableSortLabel
                active={orderBy === key}
                direction={orderBy === key ? order : 'asc'}
                onClick={event => {
                  onRequestSort(event, key);
                }}
              >
                <b>{headCells[key].label}</b>
                {orderBy === key ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

SortableTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const SortableTableToolbar = () => {
  const classes = useToolbarStyles();
  return (
    <Box>
      <Toolbar>
        <Typography className={classes.title} variant="h6" id="tableTitle" component="span">
          Active Wifi Networks
        </Typography>
      </Toolbar>
    </Box>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '90%',
    margin: theme.spacing(2),
  },
  paper: {
    width: '100%',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  table: {
    minWidth: 550,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  chips: {
    display: 'flex',
    justifyContent: 'left',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.2),
    },
  },
}));

function descendingComparator(a, b, orderBy) {
  if (headCells[orderBy].numeric) {
    return parseInt(b[orderBy]) < parseInt(a[orderBy])
      ? -1
      : parseInt(b[orderBy]) > parseInt(a[orderBy]);
  } else {
    return a[orderBy] < b[orderBy] ? -1 : a[orderBy] > b[orderBy];
  }
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function extractWPA(wpas) {
  let list = wpas.split(' ').map((str, idx) => {
    return <Chip color="primary" size="small" label={str} key={idx} />;
  });

  return list;
}

function Bar2IconMapper(bars){
  switch (bars) {
    case '▂▄▆█':
      return <SignalWifi4Bar />
    case '▂▄▆_':
      return <SignalWifi3Bar />
    case '▂▄__':
      return <SignalWifi2Bar />
    case '▂___':
      return <SignalWifi1Bar />
    case '____':
      return <SignalWifi0Bar />
    default:
      break;
  }
}

function renderTableCell(key, row, classes){
  if(key == in_use && row[key].length > 0){
    return       <Skeleton
    variant="circle"
    width={10}
    height={10}
    style={{
      background: green.A200,
      alignContent: 'center',
      padding: 0,
    }}
  />
  }
  else if(key == security){
    return <div className={classes.chips}>{extractWPA(row[security])}</div>
  }
  else if(key == bars){
    return Bar2IconMapper(row[key]);
  }
  else{
    return row[key]
  }
}

function SortableTable(props) {
  const classes = useStyles();
  const [order, setOrder] = useState(initial_direction);
  const [orderBy, setOrderBy] = useState(in_use);
  const { rows } = props;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <SortableTableToolbar />
        <TableContainer>
          <Table className={classes.table} aria-labelledby="tableTitle" aria-label="sortable table">
            <SortableTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={index}
                    style={{
                      background: row[in_use].length > 0 ? active_color : null,
                    }}
                  >
                    {Object.keys(headCells).map(function(key) {
                      return (
                        <TableCell key={key} align="center">
                          {renderTableCell(key, row, classes)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
