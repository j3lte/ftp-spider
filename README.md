ftp-spider
===========

[![NPM](https://nodei.co/npm/ftp-spider.svg?downloads=true&stars=true)](https://nodei.co/npm/ftp-spider/)
[![npm version](https://badge.fury.io/js/git-spider.svg)](http://badge.fury.io/js/git-spider)


Spider through an open FTP server. This will recursively go through the file listing. It has the ability to download the files (kind of what `wget --mirror` does), although this needs further finetuning (downloading a lot of files seems to mess with the sockets). The tool can also output a JSON file with the file structure.

**This is work in progress. Any PR's or feedback is welcome.**

## How do I set up this?

First off, make sure you've got a working installation of NodeJS and npm.

Then install it using npm:

```
$ npm install -g ftp-spider
```

## Usage

```

Spider an FTP server

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

```

## Bugs / issues / features

Please, if you find any bugs, or are a way better developer than I am (as in, you are thinking 'spaghetti' when looking at my code), feel free to create an issue. [Pull request](https://github.com/j3lte/ftp-spider/pulls) are welcome!

## [License](https://github.com/j3lte/ftp-spider/blob/master/LICENSE)

(The MIT License)

Copyright (c) 2017 Jelte Lagendijk (jwlagendijk@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
