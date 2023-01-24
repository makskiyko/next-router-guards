#!/usr/bin/env node

import {Dirent, readdirSync} from 'fs';

const fileNames: string[] = [];

const readDirectory = (path: string) => {
  readdirSync(path, {withFileTypes: true}).forEach((file: Dirent) => {
    if (file.isFile()) {
      fileNames.push(file.name);
      return;
    }

    if (file.isDirectory()) {
      console.log(file.name);
      // readDirectory(path + '/' + file.name);
    }
  });
};

readDirectory('./pages');

console.log(fileNames);
