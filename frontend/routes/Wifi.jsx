import * as React from 'react';
import MaterialTable from 'material-table';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import { exec_table, exec } from '../util/exec';

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
      exec_table('nmcli device wifi list').then(result => this.setState({ wifi_networks: result }));
      exec('date').then(result => this.setState({ last_refresh: result }));
    }, 10000);
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
                    return <Chip key={tag} label={tag} variant="outlined" />;
                  });
                },
              },

              { title: 'MODE', field: 'MODE', sorting: false },
              { title: 'CHAN', field: 'CHAN', sorting: false },
              { title: 'RATE', field: 'RATE', sorting: false },
            ]}
            data={[...this.state.wifi_networks]}
            options={{
              headerStyle: {
                backgroundColor: '#FA8756',
                color: '#FFF',
              },
              rowStyle: {
                'font-family': 'Inter, sans-serif',
              },
            }}
            title="Wifi Networks"
          />
        )}
      </div>
    );
  }
}

// function Table(props) {
//   const { data } = props;
//   if (data.length === 0) return <table />;
//   return (
//     <table>
//       <thead>
//         <tr>
//           {Object.keys(data[0]).map(s => (
//             <th key={s}>{s}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((row, i) => (
//           <tr key={i}>
//             {Object.values(row).map((s, i) => (
//               <td key={i}>{s}</td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }
