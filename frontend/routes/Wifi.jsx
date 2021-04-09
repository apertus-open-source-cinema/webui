import * as React from 'react';

import { withTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { exec_table, exec } from '../util/exec';
import DataTable from '../components/DataTable.jsx';

export const title = 'Wifi Configuration';
export const route = '/wifi';

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
          <div>
            <DataTable rows={this.state.wifi_networks} />
          </div>
        )}
      </div>
    );
  }
}

export const Component = withTheme(ComponentRaw);
