"use strict";

const request = require('request-promise');
const messages = require('elasticio-node').messages;
const API_BASE_URI = 'https://api.github.com';

exports.process = processAction;

function processAction(msg, cfg) {
    // access token got by the login from the API
    const apiKey = cfg.apiKey;

    // access the value of the apiUrl field defined in credentials section of component.json
    const API_URL = cfg.apiUrl;

    const self = this;

    const requestOptions = {
        uri: `${API_URL}/customer`,
        followAllRedirects: true,
        headers: {
          "Accept": "application/json",
          "Authorization": "Bearer " + apiKey
        },
        body: msg.body,
        json: true
    };

    console.log('Creating new customer [/]');

    request.post(requestOptions).then((res) => {
      self.emit('data', messages.newMessageWithBody(res));
    });
}
