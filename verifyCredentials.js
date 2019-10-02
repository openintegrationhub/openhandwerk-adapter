"use strict";

const request = require('request-promise');

async function getToken(config) {
  const options = {
    uri: config.apiBaseUrl + `/login`,
    json: true,
    body: {
      email: config.email,
      password: config.password,
    },
  };

  try {
    const tokenRequest = await request.post(options);
    console.log("[REQ]");
    console.log(tokenRequest);
    const { success } = tokenRequest;
    console.log(success);
    return success;
  } catch (err) {
    // console.log(`ERROR: ${err}`);
    throw new Error(err);
    return err;
  }
}

async function verifyCredentials(credentials, cb) {
  // console.log('Credentials passed for verification %j', credentials)

  try {
    const cfg = {
      email: credentials.email,
      password: credentials.password,
      apiBaseUrl: credentials.apiBaseUrl
    };

    const token = await getToken(cfg);
    console.log("TOKEN: -> ", token);

    if (token) {
      cb(null, { verified: true });
      console.log('Credentials verified successfully');
      return true;
    }

    throw new Error('Error in validating credentials!');
    return false;

  } catch (e) {
    console.log(`${e}`);
    throw new Error(e);
  }
}

module.exports = verifyCredentials;
