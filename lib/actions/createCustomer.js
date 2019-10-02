"use strict";

const request = require('request-promise');
const messages = require('elasticio-node').messages;

exports.process = processAction;

function processAction(msg, cfg) {
    // access token got by the login from the API
    const apiKey = cfg.apiKey;

    // access the value of the apiUrl field defined in credentials section of component.json
    const API_URL = cfg.apiBaseUrl;

    const self = this;

    const requestOptions = {
        uri: API_URL + `/customer`,
        followAllRedirects: true,
        headers: {
          "Accept": "application/json",
          "Authorization": "Bearer " + apiKey
        },
        body: msg.body,
        json: true
    };

    console.log('Creating new customer [/]');

    console.log(API_URL);

    request.post(requestOptions).then((res) => {
      console.log("success")
      self.emit('data', messages.newMessageWithBody(res));
    }, function(err) {
      console.log("[ERROR]");
      console.log(err);
    });
}
