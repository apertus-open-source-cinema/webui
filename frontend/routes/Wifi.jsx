import React from 'react';
import { exec_table, exec } from '../util/exec';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import color from '@material-ui/core/colors/amber';



export const title = 'Wifi Configuration';
export const route = '/wifi';

export class Component extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      wifi_networks: [],
      last_refresh: ''
    };



    setInterval(() => {
      exec_table('nmcli dev wifi')
      .then(result => {
        if(!result)
          return;
          
        this.setState({
          wifi_networks: result,
        });
      });
      exec('date')
      .then(result => {
        this.setState({ 
          last_refresh: result
        })
        
      }
        );
    }, 1000);
  }


  render() {
    return (
      <div>
        <EnhancedTable rows={this.state.wifi_networks}/>
      </div>
    );
  }

}


const headCells = [
  { id: 'IN-USE', numeric: false, disablePadding: true, label: 'In-Use' },
  { id: 'BSSID', numeric: false, disablePadding: false, label: 'BSSID' },
  { id: 'SSID', numeric: false, disablePadding: false, label: 'SSID' },
  { id: 'MODE', numeric: false, disablePadding: false, label: 'MODE' },
  { id: 'CHAN', numeric: true, disablePadding: false, label: 'CHAN' },
  { id: 'RATE', numeric: true, disablePadding: false, label: 'RATE (Mbits/sec)' },
  { id: 'SIGNAL', numeric: true, disablePadding: false, label: 'SIGNAL' },
  { id: 'BARS', numeric: false, disablePadding: false, label: 'BARS' },
  { id: 'SECURITY', numeric: false, disablePadding: false, label: 'SECURITY' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align='center'
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
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

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  return (
    <Toolbar>
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          Wifi 
        </Typography>

    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
};

const useStyles = makeStyles((theme) => ({
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
}));

function descendingComparator(a, b, orderBy) {
  let is_num = false;
  headCells.map((element)=>{
    if(element.id == orderBy)
      is_num = is_num || element.numeric
  });

  if(is_num){
    if (parseInt(b[orderBy]) < parseInt(a[orderBy])) {
      return -1;
    }
    if (parseInt(b[orderBy]) > parseInt(a[orderBy])) {
      return 1;
    }
    return 0;
  }
  else{
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
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState(headCells[0].id);
  const [dense, setDense] = React.useState(false);
  const {rows} = props;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={index}                 
                      >               
                      {
                        headCells.map((element)=>{
                        return <TableCell key={element.id} align="center">{row[element.id]}</TableCell>
                        })
                      }
                    </TableRow>
                  );
                })}

              {/* {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={headCells.length} />
                </TableRow>
              )} */}

            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
  );
};
