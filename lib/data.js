/**
 * Data module: Using fs module to implement CRUD
 */
// dependencies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

// Data module container
let lib = {};
lib.baseDir = path.join(__dirname, '../.data');

// assuming all files created have .json extension
// C in CRUD
lib.create = (dir, file, data, callback) => {
  // 'wx' mode is similar to 'w', but it fails if the path already exists
  fs.open(`${lib.baseDir}/${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);
      fs.writeFile(fileDescriptor, stringData, err => {
        if (!err) {
          fs.close(fileDescriptor, err => {
            if (!err) {
              callback(false);
            } else {
              callback('Error closing file');
            }
          })
        } else {
          callback('Error writing to the file');
        }
      })
    } else {
      callback('File already exists');
    }
  });
};

// R in CRUD
lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.baseDir}/${dir}/${file}.json`, 'utf8', (err, data) => {
    if (!err && data) {
      const parsedData = helpers.jsonParser(data);
      callback(false, parsedData);
    } else {
      callback(err, data);
    }
  })
};

// U in CRUD
lib.update = (dir, file, data, callback) => {
  fs.open(`${lib.baseDir}/${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);
      // truncate the file
      fs.truncate(fileDescriptor, err => {
        if (!err) {
          // write & close the file
          fs.writeFile(fileDescriptor, stringData, err => {
            if (!err) {
              fs.close(fileDescriptor, err => {
                if (!err) {
                  callback(false);
                } else {
                  callback('Error closing file');
                }
              })
            } else {
              callback('Error writing to the file');
            }
          })
        } else {
          callback('Error truncating file');
        }
      });
    }
  });
};

// D in CRUD
lib.delete = (dir, file, callback) => {
  fs.unlink(`${lib.baseDir}/${dir}/${file}.json`, err => {
    callback(err);
  })
};

module.exports = lib;
