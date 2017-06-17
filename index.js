/*
 * ftp-spider
 * https://github.com/j3lte/ftp-spider
 *
 * Copyright (c) 2017 Jelte Lagendijk
 * Licensed under the MIT license.
 */

const FTP = require('ftpimp');
const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');

const Spider = require('./lib/spider');
const { buildTree } = require('./lib/json');

const fileList = [];
const cwd = process.cwd();
const createJSON = raw => buildTree(fileList, !!raw);

const run = (opts) => {
  const { startPath, host, depth, search, folders, json, rawjson, done, mirror } = opts;
  const maxDepth = depth || 5;
  const offSetDepth = startPath.split('/').length - 1;

  const newDir = path.join(cwd, host);
  if (mirror) {
    fs.ensureDirSync(newDir);
  }

  let currentDepth = 0;
  // let handled = 0;

  const pushToList = (p) => {
    // handled += 1;
    const f = _.find(fileList, fl => fl.path === p.path);
    if (
      !f &&
      ((search !== null && p.path.toLowerCase().indexOf(search.toLowerCase()) !== -1) ||
      (search === null))
    ) {
      console.log(p.path);
      fileList.push(p);
    }
  };

  const config = {
    host,
    port: 21,
    user: 'anonymous',
    debug: false,
  };

  const ftp = FTP.create(config, false);

  ftp.connect(() => {
    console.log(`Connected to remote FTP server: ${host}`);
    const spider = new Spider({
      ftp,
      concurrent: 5,
      delay: 0,
      mirror: mirror ? newDir : false,
      logs: process.stderr,
      allowDuplicates: false,
      catchErrors: true,
      error: (err, p) => {
        console.log(err, p);
      },
      maxDepth,
      done: () => {
        console.log('ALL DONE');
        if (json || rawjson) {
          let fileName;
          if (json) {
            fileName = typeof json === 'boolean' ? `${host}.json` : json;
          } else {
            fileName = typeof rawjson === 'boolean' ? `${host}.json` : rawjson;
          }
          const filePath = path.join(cwd, fileName);
          const contents = createJSON(rawjson);
          if (done) {
            done.call(this, contents);
          } else {
            fs.outputJsonSync(filePath, contents, { spaces: 2 });
          }
        } else if (done) {
          done.call(this, fileList);
        }
        ftp.exit();
      },
    });

    const handleRequest = (doc) => {
      pushToList({
        path: doc.filePath,
        type: 'folder',
      });
      doc.res.forEach((d) => {
        const filePath = path.join(doc.filePath, d.filename);
        const pathDepth = (filePath.split('/').length - 1) - offSetDepth;
        if (pathDepth > currentDepth) {
          currentDepth = pathDepth;
        }
        if ((folders && d.isDirectory) || !folders) {
          pushToList({
            path: filePath,
            type: d.isDirectory ? 'folder' : 'file',
            raw: d,
          });
          if (pathDepth < spider.opts.maxDepth && (d.isDirectory || (d.isFile && mirror))) {
            spider.queue({
              filePath,
              done: handleRequest,
              dir: d.isDirectory,
            });
          }
        }
      });
    };
    spider.load({
      filePath: startPath,
      done: handleRequest,
    });
  });
};

module.exports = {
  run,
};
