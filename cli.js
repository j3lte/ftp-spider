/*
 * ftp-spider
 * https://github.com/j3lte/ftp-spider
 *
 * Copyright (c) 2017 Jelte Lagendijk
 * Licensed under the MIT license.
 */

const meow = require('meow');

const { run } = require('./');

const cli = meow(`
  Usage
    $ ftp-spider <ip>

  Options
    --search, -s   Search for a specific string (not case-sensitive)
    --depth, -d    Maximum depth (default: 5)
    --path, -p     Start path
    --mirror, -m   Mirror (not fully functioning yet, prone to breaking)
    --folders, -f  Folders only
    --json, -j     Output to JSON (provide filename, default: <ip>.json)
    --rawjson, -r  Output to JSON (provide filename, default: <ip>.json), with file info

  Examples
    $ ftp-spider 127.0.0.1
    $ ftp-spider -s 'Documents' 127.0.0.1
    $ ftp-spider -d 10 127.0.0.1
    $ ftp-spider -p '/html' 127.0.0.1
    $ ftp-spider -j 127.0.0.1

`, {
  alias: {
    s: 'search',
    d: 'depth',
    p: 'path',
    m: 'mirror',
    f: 'folders',
    j: 'json',
    r: 'rawjson',
  },
});

const flagOrAlternative = (flag, alternative) => (cli.flags[flag] === 'undefined' ? alternative : cli.flags[flag]);

const search = flagOrAlternative('search', null);
const depth = flagOrAlternative('depth', null);
const path = flagOrAlternative('path', null);
const mirror = flagOrAlternative('mirror', false);
const folders = flagOrAlternative('folders', false);
const json = flagOrAlternative('json', null);
const rawjson = flagOrAlternative('rawjson', null);

if (cli.input.length !== 1 || typeof search === 'boolean' || typeof depth === 'boolean' || typeof path === 'boolean' || typeof folders !== 'boolean') {
  console.log(`${cli.help}\n`);
  process.exit(0);
}

const startPath = path || '/';
const host = cli.input[0];

run({
  host,
  search,
  folders,
  depth,
  startPath,
  mirror,
  json,
  rawjson,
});
