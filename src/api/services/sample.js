const ServerError = require('../../lib/error');
/**
 * @param {Object} options
 * @param {Object} options.body Sample object to submit
 * @throws {Error}
 * @return {Promise}
 */
module.exports.putIoTSample = async (options) => {
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new ServerError({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  return {
    status: 201,
    data: {
      1234: 32.1
    }
  };
};

/**
 * @param {Object} options
 * @param {Integer} options.ts 
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getFleetSample = async (options) => {
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new ServerError({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  return {
    status: 200,
    data: {
      ts: 1582691428,
      1234: 34.1,
      5678: 42.9
    }
  };
};

