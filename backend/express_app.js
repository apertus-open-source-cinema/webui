// SPDX-FileCopyrightText: © 2019 Jaro Habiger <jarohabiger@googlemail.com>
// SPDX-License-Identifier: AGPL-3.0-only

const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/../dist/`));
app.use((req, res) => res.sendFile(path.resolve(`${__dirname}/../dist/index.html`)));

module.exports = app;
