const { exec } = require('child_process');

function on_connection (connection) {
    connection.on('exec', (comand, callback) => {
        exec(comand, callback);
    })
}

module.exports = on_connection;