"use strict";

const request = require('request-promise');

async function getToken(config) {
  console.log("getting token..");

  const getTokenOptions = {
    uri: config.apiBaseUrl + `/login`,
    body: {
      'email': config.email,
      'password': config.password
    }
  };

  //const tokenRequest = await request.post(getTokenOptions);
  console.log("request token..");
  return request.post(getTokenOptions);
  //const tokenObject = JSON.parse(tokenRequest);
  //const token = tokenObject.access_token;
  //console.log("token retrieved: ", token);
  //return token;
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

    console.log("token got: - ", token);

    return token.then(function(token) {
      console.log("[PROMISE ANSWER - TOKEN]", token);
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
    console.log("Error again");
    console.log(`${e}`);
    throw new Error(e);
  }
}

module.exports = verifyCredentials;
