/*
 * ftp-spider
 * https://github.com/j3lte/ftp-spider
 *
 * Copyright (c) 2017 Jelte Lagendijk
 * Licensed under the MIT license.
 */

const path = require('path');
const fs = require('fs-extra');

class Spider {

  constructor(opts) {
    this.opts = opts || {};
    this.ftp = opts.ftp;
    this.opts.concurrent = opts.concurrent || 10;

    this.pending = [];
    this.active = [];
    this.visited = [];
  }

  log(status, filePath) {
    if (this.opts.log) {
      this.opts.logs.write(`Spider: ${status} ${filePath}\n`);
    }
  }

  full() {
    return this.active.length >= this.opts.concurrent;
  }

  queue(opts) {
    const { filePath } = opts;
    if (this.visited[filePath]) {
      return;
    }
    this.visited[filePath] = true;
    if (this.full()) {
      this.log('Queueing', filePath);
      this.pending.push(opts);
    } else {
      this.load(opts);
    }
  }

  load(opts) {
    const { done, filePath, dir } = opts;
    const isDir = typeof dir === 'undefined' ? true : dir;
    this.log('Loading', filePath);
    this.active.push(filePath);
    if (isDir) {
      this.loadPath(filePath, (err, res) => {
        if (err) {
          this.error(err, null);
          return this.finished(filePath);
        }

        const doc = {
          filePath,
          res,
        };

        this.log('Success', filePath);

        if (this.opts.catchErrors) {
          try {
            done.call(this, doc);
          } catch (e) {
            this.error(e, filePath);
          }
        } else {
          done.call(this, doc);
        }
        return this.finished(filePath);
      });
    } else if (this.opts.mirror) {
      this.loadFile(filePath, (err) => {
        if (err) {
          this.error(err, null);
        }
        return this.finished(filePath);
      });
    } else {
      this.finished(filePath);
    }
  }

  loadPath(filePath, cb) {
    this.log('Loading', filePath);
    this.ftp.ls(filePath, cb);
  }

  loadFile(filePath, cb) {
    this.log('Saving', filePath);
    const savePath = path.join(this.opts.mirror, filePath);
    const saveFolder = path.dirname(savePath);
    fs.ensureDirSync(saveFolder);
    console.log(`Saving ${filePath} to ${savePath}`);
    this.ftp.save([filePath, savePath], (err, filename) => {
      if (err) {
        console.log(`Error saving ${savePath}`);
      } else {
        console.log(`Saved ${filePath}`);
      }
      cb(err, filename);
    });
  }

  error(err, url) {
    this.log('Error', url);
    if (!this.opts.error) {
      throw err;
    }
    this.opts.error(err, url);
  }

  dequeue() {
    const args = this.pending.shift();
    if (args) {
      this.load.call(this, args);
    } else if (this.opts.done && this.active.length === 0) {
      this.opts.done.call(this);
    }
  }

  finished(filePath) {
    const i = this.active.indexOf(filePath);
    if (i === -1) {
      return this.log('URL was not active', filePath);
    }
    this.active.splice(i, 1);

    if (!this.full()) {
      if (this.opts.delay) {
        setTimeout(this.dequeue.bind(this, filePath), this.opts.delay);
      } else {
        this.dequeue(filePath);
      }
    }
    return true;
  }

}

module.exports = Spider;
