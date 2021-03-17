import * as React from 'react';
import { exec_table, exec } from '../util/exec';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Tablee from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export const title = 'Wifi Configuration';
export const route = '/wifi';

const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export class Component extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      wifi_networks: [],
      last_refresh: '',
    };
    setInterval(() => {
      exec_table('nmcli dev wifi').then(result => this.setState({ wifi_networks: result }));
      exec('date').then(result => this.setState({ last_refresh: result }));
    }, 1000);
  }

  render() {
    return (
      <div>
        <Table data={this.state.wifi_networks} />
      </div>
    );
  }
}


function Table(props) {
  const classes = useStyles()
  const { data } = props;

  if (data.length === 0) return <table />;
  return (
    <TableContainer component={Paper}>
      <Tablee className={classes.table} aria-label="simple table">
        <TableHead>
          <StyledTableRow>
            {Object.keys(data[0]).map(s => (
              <StyledTableCell key={s}>{s}</StyledTableCell>
            ))}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <StyledTableRow align="right" key={i}>
              {Object.values(row).map((s, i) => (
                <StyledTableCell key={i}>{s}</StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Tablee>
    </TableContainer>
  );
}
