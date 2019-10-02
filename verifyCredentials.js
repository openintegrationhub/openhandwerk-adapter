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

  try {
    const tokenRequest = await request.post(getTokenOptions);
    const tokenObject = JSON.parse(tokenRequest);
    const token = tokenObject.access_token;
    return token;
  } catch (e) {
    console.log(`ERROR: ${e}`);
    throw new Error(e);
  }
}

async function verifyCredentials(credentials, cb) {
  console.log('Credentials passed for verification %j', credentials)

  try {
    const cfg = {
      email: credentials.email,
      password: credentials.password,
      apiBaseUrl: credentials.apiBaseUrl
    };

    const token = getToken(cfg);

    return token.then(function(token) {
      console.log("[PROMISE ANSWER - TOKEN]", token)
      if (token !== false) {
        cb(null, { verified: true });
        console.log('Credentials verified successfully');
        credentials.apiKey = token;
        return true;
      } else {
        throw new Error('Error in validating credentials!');
      }
    }, function() {
      console.log("credentials invalid")
      cb(null, { verified: false });
    });
  } catch (e) {
    console.log(`${e}`);
    throw new Error(e);
  }
}

module.exports = verifyCredentials;
