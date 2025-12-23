// SPDX-FileCopyrightText: © 2019 Jaro Habiger <jarohabiger@googlemail.com>
// SPDX-License-Identifier: AGPL-3.0-only

import openSocket from 'socket.io-client';

if (!window.socket && !process.env.MOCK) {
  const socket = openSocket('/');
  window.socket = socket;
} else {
  window.socket = {
    emit: (name, dummy, callback) => {
      callback(undefined, '', '');
    },
  };
}

export async function exec(command) {
  return new Promise((resolve, reject) => {
    window.socket.emit('exec', command, (error, stdout, stderr) => {
      if (error) {
        error.stderr = stderr;
        error.stdout = stdout;
        reject(error);
      }
      resolve([stdout, stderr]);
    });
  });
}

window.exec = exec;

export async function exec_table(command, skip_lines, header_row, separator, strip_non_ascii) {
  separator = separator || ' ';
  skip_lines = skip_lines || 0;

  const [stdout, stderr] = await exec(command);
  let lines = stdout
    .split('\n')
    .map(l => (strip_non_ascii ? l.replace(/[^\x00-\x7F]/g, '') : l))
    .filter(l => l)
    .filter((_, i) => i >= skip_lines);

  // find row seperators
  if (!lines[0]) console.warn(stdout, stderr);
  let row_breaks = Array.from(Array(lines[0].length).keys())
    .filter(index => lines.every(l => l[index] === separator))
    .filter((v, i, l) => v !== l[i - 1] + 1);

  let fields = lines.map(line =>
    [0, ...row_breaks].map((v, i, l) => line.substring(v, l[i + 1] || line.length))
  );
  let trimmed_fields = fields.map(l => l.map(f => f.trim()));

  if (!header_row) {
    header_row = trimmed_fields[0];
    trimmed_fields = trimmed_fields.slice(1, lines.length);
  }

  const result = trimmed_fields.map(l => {
    let obj = {};
    l.forEach((v, i) => (obj[header_row[i]] = v));
    return obj;
  });

  return result;
}

window.exec_table = exec_table;
