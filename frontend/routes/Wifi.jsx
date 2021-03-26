import * as React from 'react';
import { forwardRef } from 'react';
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { withTheme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import { exec_table, exec } from '../util/exec';

export const title = 'Wifi Configuration';
export const route = '/wifi';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

class ComponentRaw extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      wifi_networks: [],
      last_refresh: '',
    };
    this.id = setInterval(() => {
      exec_table('nmcli device wifi list').then(result => this.setState({ wifi_networks: result }));
      exec('date').then(result => this.setState({ last_refresh: result }));
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.id);
  }

  render() {
    return (
      <div style={{ padding: '40px' }}>
        {this.state.wifi_networks.length == 0 ? (
          <Typography variant="h2" color="textSecondary">
            No wifi networks available
          </Typography>
        ) : (
          <MaterialTable
            icons={tableIcons}
            columns={[
              {
                title: 'SSID',
                field: 'SSID',
                render: rowData => {
                  if (rowData['IN-USE'] != '') {
                    return <p style={{ color: '#ec0101' }}>{rowData.SSID}</p>;
                  } else {
                    return <p>{rowData.SSID}</p>;
                  }
                },
                sorting: true,
                defaultSort: 'asc',
              },
              {
                title: 'SIGNAL',
                field: 'SIGNAL',
                type: 'numeric',
                sorting: true,
                defaultSort: 'asc',
              },
              {
                title: 'SECURITY',
                field: 'SECURITY',
                sorting: false,
                render: rowData => {
                  return rowData['SECURITY'].split(' ').map(tag => {
                    return (
                      <Chip key={tag} label={tag} variant="outlined" style={{ margin: '2px' }} />
                    );
                  });
                },
              },

              { title: 'MODE', field: 'MODE', sorting: true, defaultSort: 'asc' },
              { title: 'CHAN', field: 'CHAN', type: 'numeric', defaultSort: 'asc', sorting: true },
              { title: 'RATE', field: 'RATE', sorting: true, defaultSort: 'asc' },
            ]}
            data={[...this.state.wifi_networks]}
            options={{
              headerStyle: {
                backgroundColor: this.props.theme.palette.primary.main,
                color: '#FFF',
              },
              emptyRowsWhenPaging: false,
            }}
            title="Wifi Networks"
          />
        )}
      </div>
    );
  }
}

export const Component = withTheme(ComponentRaw);
