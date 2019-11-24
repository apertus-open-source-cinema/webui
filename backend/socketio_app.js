const { exec } = require('child_process');

function on_connection(connection) {
  connection.on('exec', (comand, callback) => {
    console.log('executing', comand);
    // 100Mb buffer size is a LOT!
    exec(comand, {maxBuffer: 1024 * 1024 * 100}, callback);
  });
}

module.exports = on_connection;
