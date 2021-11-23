// SPDX-FileCopyrightText: © 2019 Jaro Habiger <jarohabiger@googlemail.com>
// SPDX-License-Identifier: AGPL-3.0-only

import { usePromiseGenerator } from '../util/usePromiseGenerator';
import { Fs } from '../util/fs';
import * as React from 'react';

export function FileContent({ path }) {
  const value = usePromiseGenerator(() => Fs.of(path).load(), path);
  return <NullableValue value={value} error={'not readable'} />;
}

export function NullableValue({ value, error }) {
  if (value === null) {
    return <span style={{ color: 'red' }}>{error}</span>;
  } else if (typeof value === 'string') {
    return value;
  } else {
    return <></>;
  }
}
