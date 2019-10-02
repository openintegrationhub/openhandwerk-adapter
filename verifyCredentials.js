"use strict";

const request = require('request-promise');

async function getToken(config) {
  const getTokenOptions = {
    uri: config.apiBaseUrl + `/login`,
    body: {
      'email': config.email,
      'password': config.password
    }
  };

  return request.post(getTokenOptions);
}

async function verifyCredentials(credentials, cb) {
  console.log('Credentials passed for verification %j', credentials)

  try {
    const cfg = {
      email: credentials.email,
      password: credentials.password,
      apiBaseUrl: credentials.apiBaseUrl
    };

    return getToken(cfg);
  } catch (e) {
    console.log("Error again");
    console.log(`${e}`);
    throw new Error(e);
  }
}

module.exports = verifyCredentials;
