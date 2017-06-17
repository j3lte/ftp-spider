/*
 * ftp-spider
 * https://github.com/j3lte/ftp-spider
 *
 * Copyright (c) 2017 Jelte Lagendijk
 * Licensed under the MIT license.
 */

const path = require('path');
const _ = require('lodash');

const findNames = (items, name) => _.find(items, i => i.name === name);

const buildTree = (files, addRaw) => {
  const result = {
    path: '/',
    type: 'folder',
    items: [],
  };
  let temporary = result;

  _.forEach(files, (file) => {
    const resolved = path.parse(file.path);
    const dirArr = resolved.dir.split('/').filter(f => f !== '').concat([resolved.base]);

    temporary = result;
    const pathArray = [''];
    let name;

    while ((name = dirArr.shift())) {
      let entry = findNames(temporary.items, name);
      pathArray.push(name);
      if (!entry) {
        const genPath = pathArray.join('/');
        const rawFile = _.find(files, rawF => rawF.path === genPath);
        const raw = rawFile ? rawFile.raw : null;
        const type = file.type;

        entry = { name, type, path: genPath };

        if (addRaw) entry.raw = raw;
        if (type === 'folder') entry.items = [];

        if (type === 'folder' || dirArr.length === 0) {
          temporary.items.push(entry);
        } else {
          console.log(`Something is not right while making JSON for: ${genPath}`);
        }
      }
      temporary = entry;
    }
  });

  return result;
};

module.exports = {
  buildTree,
};
