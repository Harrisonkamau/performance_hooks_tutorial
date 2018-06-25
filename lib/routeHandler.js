/**
 * Routes handler
 */

const _data = require('./data');

let handler = {};

// Index handler
handler.index = (data, callback) => {
  callback(200, { Message: 'Hello world!' });
};

// Not Found
handler.notFound = (data, callback) => {
  callback(404, { Message: 'Not Found' });
};

// User handler
handler.user = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > - 1) {
    handler._user[data.method](data, callback);
  } else {
    callback(405);
  }
};

handler._user = {};
/* User - POST
* Required arguments: firstName, lastName, phone (length of 10) E.G. 0711223344
*/
handler._user.post = (data, callback) => {
  // sanity check on the required fields
  const firstName = typeof (data.payload.firstName) == 'string'
    && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;

  const lastName = typeof (data.payload.lastName) == 'string'
    && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;

  const phone = typeof (data.payload.phone) == 'string'
    && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

  if (firstName && lastName && phone) {
    // check if the use already exists
    _data.read('users', phone, (err, data) => {
      // only create a new user if one doesn't exist
      const userObj = {
        firstName,
        lastName,
        phone
      };

      if (err) {
        _data.create('users', phone, userObj, (err) => {
          if (!err) {
            callback(200, { User: userObj });
          } else {
            callback(400, { Error: 'Error creating new user' });
          }
        });
      } else {
        callback(400, { Error: 'User already exists' });
      }
    })

  } else {
    callback(500, { Error: 'Missing required fields' });
  }
};

/* User - GET
* Required arguments: phone (length of 10) E.G. 0711223344
*/
handler._user.get = (data, callback) => {
  const phone = typeof (data.queryString.phone) == 'string'
    && data.queryString.phone.trim().length == 10 ? data.queryString.phone.trim() : false;
  _data.read('users', phone, (err, userData) => {
    if (!err && userData) {
      callback(200, userData);
    } else {
      callback(400, { Error: 'User with the given phone number is not found' });
    }
  })
};

/* User - PUT
* Required arguments: phone (length of 10) E.G. 0711223344
* Optional args: firstName, lastName
*/
handler._user.put = (data, callback) => {
  const firstName = typeof (data.payload.firstName) == 'string'
    && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;

  const lastName = typeof (data.payload.lastName) == 'string'
    && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;

  const phone = typeof (data.payload.phone) == 'string'
    && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

  if (phone) {
    if (firstName || lastName) {
      _data.read('users', phone, (err, userData) => {
        if (!err && userData) {
          if (firstName) {
            userData.firstName = firstName;
          }
          if (lastName) {
            userData.lastName = lastName;
          }
          _data.update('users', phone, userData, (err) => {
            if (!err) {
              callback(200, userData);
            } else {
              callback(400, { Error: 'Error updating user' });
            };
          })
        }
      })
    } else {
      callback(400, { Error: 'Missing required fields' });
    }
  } else {
    callback(400, { Error: 'Provide a valid phone number' });
  }
};

/* User - DELETE
* Required arguments: phone (length of 10) E.G. 0711223344
*/
handler._user.delete = (data, callback) => {
  const phone = typeof (data.queryString.phone) == 'string'
    && data.queryString.phone.trim().length == 10 ? data.queryString.phone.trim() : false;
  if (phone) {
    _data.read('users', phone, (err, userData) => {
      if (!err && userData) {
        _data.delete('users', phone, err => {
          if (!err) {
            callback(200, { Message: 'User deleted successfully' });
          } else {
            callback(400, { Error: 'Error deleting user' });
          }
        })
      } else {
        callback(400, { Error: 'User not found' });
      }
    })
  } else {
    callback(400, { Error: 'Provide a valid phone number' });
  }
};


module.exports = handler;
